import React from "react";
import { API, graphqlOperation } from 'aws-amplify';
import { createMarket } from '../graphql/mutations';
import {  UserContext } from '../App';

// prettier-ignore
import { Form, Button, Dialog, Input, Select, Notification } from 'element-react'

class NewMarket extends React.Component {
  state = {
    name: "",
    selectedTags: [],
    tags: ["Arts", "Web Dev", "Technology", "Crafts", "Entertainment"], 
    addMarketDialog: false,
    options: []
  };

  handleAddMarket = async (user) => {
    console.log(this.state.name);
    try {
      // false hides dialong
      this.setState({ addMarketDialog: false });

      // provide arguments to create market mutations
      const input = {
         name: this.state.name,
         tags: this.state.selectedTags,
         owner: user.username
      };
      const result = await API.graphql(
        graphqlOperation(createMarket, { input })
      )
      console.log({ result });
      console.info(`Created market: id ${result.data.createMarket.id}`)
      this.setState({ name: "", selectedTags: []})
    } catch(err){
      console.error('Error adding new market ', err);
      Notification.error({
        title: "Error",
        message: `${err.message || "Error adding market"}`
      });
    }

  };

   handleFilterTags = query => {
     const options = this.state.tags
     .map(tag => ({ value: tag, label: tag }))
     .filter(tag => tag.label.toLowerCase().includes(query.toLowerCase()));
     this.setState({ options })
   }
  
  render() {
    return (
      <UserContext.Consumer>

      {/* render prop pattern - {} and function that returns all of our markup
          and gives us access to all of our data
      */}
      {({ user }) => <>
        <div className="market-header">
          <h1 className="market-title">
            Create Your MarketPlace
            <Button
              type="text"
              icon="edit"
              className="market-title-button"
              onClick={() => this.setState({ addMarketDialog: true})}
            />
            </h1>
          <Dialog
            title="Create New Market"
            visible={this.state.addMarketDialog}
            onCancel={() => this.setState({ addMarketDialog: false })}
            size="large"
            customClass="dialog"
          >
            <Dialog.Body>
              <Form labelPosition="top">

                <Form.Item label="Add Market Name">
                { /* Adding the value prop makes this a controlled component  -- to clear name from state */ } 
                  <Input
                    placeholder="Market Name"
                    trim={true}
                    onChange={name => this.setState({ name })}
                    value={this.state.name} 
                  />
                </Form.Item>
                <Form.Item label ="Add Tags">
                    <Select
                      multiple={true}
                      filterable={true}
                      placeholder="Market Tags"
                      onChange={selectedTags => this.setState({ selectedTags })}
                      remoteMethod={this.handleFilterTags}
                      remote={true}
                    >  
                    {this.state.options.map(option => (
                      <Select.Option
                        key={option.value}
                        label={option.label}
                        value={option.value}
                      />
                    
                    ))}
                    </Select>
                </Form.Item>
              </Form>

            </Dialog.Body>

            <Dialog.Footer>
              <Button onClick={() => this.setState({ addMarketDialog: false})}>
                Cancel
              </Button>
              <Button
                type="primary"
                disable={!this.state.name}
                onClick={() => this.handleAddMarket(user)}
              >
                Add
              </Button>
              
            </Dialog.Footer>
          </Dialog>
          
          
        </div>
      </>}
      </UserContext.Consumer>
    )
  }
}

export default NewMarket;
