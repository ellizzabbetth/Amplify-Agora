import React from "react";
import { S3Image } from 'aws-amplify-react';
import { convertCentsToDollars, convertCentsToDollar } from '../utils';
import { UserContext } from '../App';
import PayButton from "./PayButton";
// prettier-ignore
import { Notification, Popover, Button, Dialog, Card, Form, Input, Radio } from "element-react";




class Product extends React.Component {
  state = {};
  
  render() {
    
    const { product } = this.props;
    console.log('product', product);

   


    return (
      <UserContext.Consumer>
       {({ user }) => {
        const isProductOwner = user && user.attributes.sub === product.owner;

        return (
          <div className="card-container">
          <Card bodyStyle = {{ padding: 0, minWidth: '200px' }}>
            <S3Image 
              imgKey={product.file.key}
              theme={{
                photoImg: { maxWidth:'100%', maxHeight: '100%' }

              }}
            />
            <div className="card-body">
              <h3 className="m-9"> {product.description}</h3>
              <div className="items-center">
                <img
                  src={`https://icon.now.sh/${product.shipped ? "markunread_mailbox" : "mail"}`}
                  alt="Shipping Icon"
                  className="icon"
                />
                {product.shipped ? "Shipped" : "Emailed"}
              </div>
              <div className="text-right">
                <span className="mx-1">
                  ${convertCentsToDollar(product.price)}
                </span>
                {!isProductOwner && (
                  <PayButton />
                )}
              </div>
            </div>
          </Card>
          </div>
        )
       }}

     

      </UserContext.Consumer>
    )
  }

  /*render() {
    return <div>Product</div>
  }*/
}

export default Product;
