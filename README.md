## schema.graphql

```graphql
type Market @model @searchable {
  id: ID!
  name: String!
  products: [Product]
    @connection(name: "MarketProducts", sortField: "createdAt")
  tags: [String!]
  owner: String!
  createdAt: String
}

type Product @model @auth(rules: [{ allow: owner, identityField: "sub" }]) {
  id: ID!
  description: String!
  market: Market @connection(name: "MarketProducts")
  file: S3Object!
  price: Float!
  shipped: Boolean!
  owner: String
  createdAt: String
}

type S3Object {
  bucket: String!
  region: String!
  key: String!
}

type User
  @model(
    mutations: { create: "registerUser", update: "updateUser" }
    queries: { get: "getUser" }
    subscriptions: null
  ) {
  id: ID!
  username: String!
  email: String!
  registered: Boolean
  orders: [Order] @connection(name: "UserOrders", sortField: "createdAt")
}

type Order
  @model(
    mutations: { create: "createOrder" }
    queries: null
    subscriptions: null
  ) {
  id: ID!
  product: Product @connection
  user: User @connection(name: "UserOrders")
  shippingAddress: ShippingAddress
  createdAt: String
}

type ShippingAddress {
  city: String!
  country: String!
  address_line1: String!
  address_state: String!
  address_zip: String!
}
```

## app.js

```javascript
var express = require("express");
var bodyParser = require("body-parser");
var awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
var stripe = require("stripe")("***");
var AWS = require("aws-sdk");

const config = {
  accessKeyId: "***",
  secretAccessKey: "***",
  region: "us-west-2",
  adminEmail: "***"
};

var ses = new AWS.SES(config);

/* Moving out of AWS SES Sandbox */
// https://docs.aws.amazon.com/ses/latest/DeveloperGuide/request-production-access.html

// declare a new express app
var app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const chargeHandler = async (req, res, next) => {
  const { token, shipped } = req.body;
  const { amount, currency, description } = req.body.charge;

  try {
    const charge = await stripe.charges.create({
      source: token.id,
      amount,
      currency,
      description
    });
    if (charge.status === "succeeded") {
      req.description = description;
      req.charge = charge;
      req.shipped = shipped;
      req.email = req.body.email;
      next();
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const convertCentsToDollars = amount => (amount / 100).toFixed(2);

const emailHandler = (req, res) => {
  const {
    shipped,
    charge,
    description,
    email: { customerEmail, ownerEmail }
  } = req;

  ses.sendEmail(
    {
      Source: config.adminEmail,
      ReturnPath: config.adminEmail,
      Destination: {
        ToAddresses: [config.adminEmail]
      },
      Message: {
        Subject: {
          Data: "Order Details - AmplifyAgora"
        },
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `<h3>Order Processed!</h3>
               <p><span style="font-weight: bold">${description}</span> - $${convertCentsToDollars(
              charge.amount
            )}</p>
               <p>Customer Mail: <a href="mailto:${customerEmail}">${customerEmail}</a></p>
               <p>Contact your seller at <a href="mailto:${ownerEmail}">${ownerEmail}</a></p>
               ${
                 shipped
                   ? `
                   <h4>Mailing Address</h4>
                   <p>
                      ${charge.source.name}
                    </p>
                    <p>${charge.source.address_line1}</p>
                    <p>
                      ${charge.source.address_city},
                     ${charge.source.address_state} 
                      ${charge.source.address_zip}
                    </p>
                  `
                   : `No shipping address provided`
               }
               <p style="font-style: italic; color: grey">${
                 shipped
                   ? "Your product will be shipped in 2-3 days"
                   : "Check your verified email for your emailed product"
               }</p>
              `
          }
        }
      }
    },
    (err, data) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.json({
        message: "Order processed successfully!",
        data,
        charge
      });
    }
  );
};

app.post("/charge", chargeHandler, emailHandler);

app.listen(3000, function() {
  console.log("App started");
});

module.exports = app;
```
