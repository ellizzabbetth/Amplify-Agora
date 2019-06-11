import React from "react";
import { PhotoPicker } from 'aws-amplify-react';
import { Storage, Auth, API, graphqlOperation  } from 'aws-amplify';
import { createProduct } from '../graphql/mutations';
import aws_exports from '../aws-exports';

//prettier-ignore
import { Form, Button, Input, Notification, Radio, Progress } from "element-react";
import { convertDollarsToCents } from '../utils';

const initialState= {
  description: "",
  price: "",
  shipped: false,
  imagePreview: "",
  image: "",
  isUploading: false /* track when things are being uploaded */
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

  handleAddProduct = async () => {
    console.log("add product", this.state);
    try {
      this.setState({ isUploading: true }); // begin adding a new product
      // select the visibility of the media file we are uploading
      const visibility = "public"; // used in file path so we know the visibility of the file from fileName
      // want the authenticated user's current credentials so that we 
      // can connect it in someway with the user that's uploading this image.
      // use Auth module.
      // identityId is a property that the authenticated user has.
      const { identityId } = await Auth.currentCredentials();
      console.log(identityId)
      // construct filename -- Date forces it to be unique 
      // the name of the uploaded image is being stored in our image property in state
      const filename= `/${visibility}/${identityId}/${Date.now()}-${this.state.image.name}`
      // 
      const uploadedFile = await Storage.put(filename, this.state.image.file, { 
        /* specify file type*/
        contentType: this.state.image.type
      })
      // Once we have uploaded the image we want to put a reference to 
      // that image in our database. Use AppSync to do this.
      // Shape as S3object type 
      const file = {
        key: uploadedFile.key,
        bucket: aws_exports.aws_user_files_s3_bucket,
        region: aws_exports.aws_project_region
      }
      console.log('file', file);
      // create the inputs to execute our create product mutation.
      // marketPage.js passes marketId from NewProduct component from our
      // dynamic route
      const input = {
        productMarketId: this.props.marketId,
        description: this.state.description,
        shipped: this.state.shipped,
        price: convertDollarsToCents(this.state.price),
        file
      }
      console.log('input ', input);
      const result = await API.graphql(graphqlOperation(createProduct, { input }));
      console.log('Created product', result);
      Notification({
        title: "Success",
        message: "Product successfully create!",
        type: "success"
      })

      // this clears out al the values that we stored in state after we logged state
      this.setState({ ...initialState});
    } catch(err) {
      console.error('Error adding new Product', err);
    }
  };

  render() {
    const { description, price, image, shipped, imagePreview, isUploading } = this.state;
    
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
                  checked={shipped === false}
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
                disabled={!image || !description || !price || isUploading}
                type="primary"
                onClick={this.handleAddProduct}
                loading={isUploading}
              >
                {isUploading ? 'Uploading ... ' : 'Add Product'}
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
