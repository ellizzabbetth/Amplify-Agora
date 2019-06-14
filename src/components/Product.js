import React from "react";
import { S3Image } from 'aws-amplify-react';
import { graphqlOperation, API } from 'aws-amplify';
import {  convertCentsToDollar, convertDollarsToCents } from '../utils';
import { UserContext } from '../App';
import PayButton from "./PayButton";
import { updateProduct, deleteProduct } from '../graphql/mutations';

// prettier-ignore
import { Notification, Popover, Button, Dialog, Card, Form, Input, Radio } from "element-react";




class Product extends React.Component {
  state = {
    description:"",
    price: "",
    shipped: false,
    updateProductDialog: false,
    deleteProductDialog: false
  };

  handleUpdateProduct = async productId => {
    // try catch for mutation
    try {

      // when the update or confirm button is clicked, hide dialog
      this.setState({ updateProductDialog: false })
      const { description, price, shipped } = this.state;
      const input = {
        id: productId,
        description,
        shipped,
        /* convert dollars back to cents because we are converting 
        price to Dollars when we set it in state */
        price: convertDollarsToCents(price)
      }
      // execute mutation
      const result = await API.graphql(graphqlOperation(updateProduct, { input }))
      console.log({ result })
      Notification({
        title: "Success",
        message: "Product successfully update!",
        type: "success",
        duration: 2000
      })
      setTimeout(() => window.location.reload(), 2000);
    } catch(err){
      console.error(`Failed to update product with id: ${productId}`, err)
      Notification.error(err);
    }
  }

  handleDeleteProduct = async productId => {
    try{
      // hide popover
      this.setState({ deleteProductDialog: false  })
      const input = {
        id: productId,
      }
      const result = await API.graphql(graphqlOperation(deleteProduct, { input }))
      console.log({ result })
      Notification({
        title: "Success",
        message: "Product successfully deleted!",
        type: "success",
        duration: 2000
      });

      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      console.error(`Failed to delete product with id ${productId}`, err);
      Notification.error(err);
    }
  }

  
  render() {
    const { deleteProductDialog, description, price, shipped, updateProductDialog } = this.state;
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
                {/* Update /Detlete Product Buttons */}
                <div className="text-center">
                  {isProductOwner && (
                    <>
                      <Button 
                        type="warning"
                        icon="edit"
                        className="m-1"
                        onClick={() => 
                          this.setState({ 
                            updateProductDialog: true,
                            description: product.description,
                            shipped: product.shipped,
                            price: convertCentsToDollar(product.price) 
                          })
                      }
                      />
                      <Popover
                        placement="top"
                        width="160"
                        trigger="click"
                        visible={deleteProductDialog}
                        content={
                          <>
                          <p>Do you want to delete this?</p>
                              <div className="text-right">
                                <Button
                                  size="mini"
                                  type="text"
                                  className="m-1"
                                  onClick ={() => this.setState({ deleteProductDialog: false })}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="primary"
                                  size="mini"
                                  className="m-1"
                                  onClick={() => this.handleDeleteProduct(product.id)}
                                >
                                  Confirm
                                </Button>
                              </div>
                          </>
                        }
                      >
                      {/* onClick allows user to toggle Cancel button */}
                        <Button
                          onClick={() => this.setState({ deleteProductDialog: true}) }
                          type="danger"
                          icon='delete'
                        />
                      </Popover>
                    </>
                  )}
                </div>

                {/* Update Product Dialog */}
                <Dialog
                  title="Update Product"
                  size="large"
                  customClass="dialog"
                  visible={updateProductDialog}
                  onCancel={() => this.setState({ updateProductDialog: false })}
                >
                  <Dialog.Body>
                    <Form labelPosition= "top">
                    <Form.Item label="Update Description">
            {/* description text is set in state */}
              <Input
            
                icon="information"
                placeholder="Product Description"
                trim ={true}
                /* make controlled input by passing value */
                value={description}
                onChange={description => this.setState({ description })}

              />
            </Form.Item>
            <Form.Item label="Set Product Price">
            {/* description text is set in state */}
              <Input
                type="number"
                icon="plus"
                placeholder="Price ($USD)"
                /* make controlled input by passing value */
                value={price}
                onChange={price => this.setState({ price })}                
              />
            </Form.Item>
            <Form.Item label="Update Shipping">
               <Radio
                  value ="true"
                  checked={shipped === true}
                  onChange={() => this.setState({ shipped: true})}
                >
                Shipped
                </Radio>
                 <Radio
                  value ="false"
                  checked={shipped === false}
                  onChange={() => this.setState({ shipped: false})}
                >
                Emailed
                </Radio>
                 

            </Form.Item>
                    </Form>
                  </Dialog.Body>

                  <Dialog.Footer>
                    <Button
                      onClick={() => this.setState({ updateProductDialog: false})}>
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => this.handleUpdateProduct(product.id)}
                      >
                      Update
                      </Button>
                  </Dialog.Footer>
                </Dialog>
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
