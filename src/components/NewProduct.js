import React from "react";
import { PhotoPicker } from 'aws-amplify-react';
//prettier-ignore
import { Form, Button, Input, Notification, Radio, Progress } from "element-react";


const initialState= {
  description: "",
  price: "",
  shipped: false,
  imagePreview: "",
  image: ""
};

class NewProduct extends React.Component {
  // To clear out state from form when it's submitted :
  // 1. swap out our state object with all the initial state values
  // 2. move state obj outside component and create it as a variable called initial state
  // 3. within state obj spread all the individual properties and values of initial state
  // 4. In handleAddProduct after adding product call setState and spread in initial state 
  // in there as well.
  state = {
    ...initialState
  };

  handleAddProduct = () => {
    console.log("add product", this.state);
    // this clears out al the values that we stored in state after we logged state
    this.setState({ ...initialState})
  };

  render() {
    const { description, price, image, shipped, imagePreview } = this.state;
    
    return (
      <div className="flex-center">
        <h2 className="header">Add New Product</h2>
        <div>
          <Form className="market-header">
            <Form.Item label="Add Product Description">
            {/* description text is set in state */}
              <Input
                type="text"
                icon="information"
                placeholder="Description"
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
            <Form.Item label="Is the Product Shipped or Emailed to the Customer?">
               <Radio
                  value ="true"
                  checked={shipped === true}
                  onChange={() => this.setState({ shipped: true})}
                >
                Shipped
                </Radio>
                 <Radio
                  value ="false"
                  checked={shipped === true}
                  onChange={() => this.setState({ shipped: false})}
                >
                Emailed
                </Radio>
                 

            </Form.Item>
              {imagePreview && (
                <img 
                className="image-preview"
                src={imagePreview}
                alt= "Product Preview"
                />

              )}
              <PhotoPicker 
                title="Product Image"
                preview= "hidden"
                onLoad={url => this.setState({ imagePreview: url })}
                /* load image file and put it in state so that we 
                can send it off with our create product mutation when we 
                execute it  */
              
                onPick={file => this.setState({ image: file })}
                theme={{
                  formContainer: { marge: 0,
                  padding: '0.8em'
                  },
                  formSection: {
                    display: 'flex',
                    alignItems: 'center'

                  },
                  sectionBody: {
                    margin: 0,
                    width: "250px"
                  },
                  sectionHeader: {
                    padding: "0.2em",
                    color: "var(--darkAmazonOrange"
                  },
                  /* case sensitive */
                  photoPickerButton: {
                    display: 'none'
                  }
                
                }}
              />
            <Form.Item>
              <Button
                disabled={!image || !description || !price}
                type="primary"
                onClick={this.handleAddProduct}
              >
                Add Product
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
  // render() {
  //   return <div>NewProduct</div>
  // }
}

export default NewProduct;
