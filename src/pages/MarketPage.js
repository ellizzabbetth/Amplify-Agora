import React from "react";
import { API, graphqlOperation } from 'aws-amplify';
import { getMarket } from '../graphql/queries';
// import { Loading, Tabs, Icon } from "element-react";

class MarketPage extends React.Component {
  state = {
    market: null
  };

  componentDidMount() {
    this.handleGetMarket();
  }

  handleGetMarket = async () => {
    const input = {
      id: this.props.marketId
    }
    const result = await API.graphql(graphqlOperation(getMarket, input ))
    console.log(result);
    this.setState({ market: result.data.getMarket });
  };
  
  render() {
    return <div>MarketPage {this.props.marketId} </div>;
  }
}

export default MarketPage;
