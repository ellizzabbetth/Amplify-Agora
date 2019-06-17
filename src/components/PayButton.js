import React from "react";
import StripeCheckout from 'react-stripe-checkout';
import Product from "./Product";
import { API } from "aws-amplify";

// import { Notification, Message } from "element-react";

const stripeConfig = {
  currency: "USD",
  publishableAPIKey: process.env.REACT_APP_publishableAPIKey
}

const PayButton = ({ product, user }) => {

  const handleCharge = async (token) => {
    try{
      const result = await API.post('orderlambda', '/charge',{
        body: {
          token
        }
      })
      console.log({result});
    } catch (err){
      console.error(err);
    }
  }

  return (
    <StripeCheckout
      token={handleCharge}
      email={user.attributes.email}
      name={product.description}
      amount={product.price}
      currency={stripeConfig.currency}
      stripeKey={stripeConfig.publishableAPIKey}
      shippingAddress={product.shipped}
      billingAddress={product.shipped}
      locale="auto"
      allowRememberMe={false}
    />
  )
}

// const PayButton = () => {
//   return <div>PayButton</div>;
// };

export default PayButton;
