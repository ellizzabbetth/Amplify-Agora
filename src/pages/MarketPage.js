import React from "react";
import { API, graphqlOperation } from 'aws-amplify';
import { getMarket } from '../graphql/queries';
import { Loading, Tabs, Icon } from "element-react";
import { Link } from 'react-router-dom';
import NewProduct from '../components/NewProduct';
import Product from '../components/Product';


class MarketPage extends React.Component {
  state = {
    market: null,
    isLoading: true, // when we visit market page, data is loading
    isMarketOwner: false // if not the owner display products the owner created. 
    // if the owner display tab to add new products.
  };

  componentDidMount() {
    this.handleGetMarket();
  }
 
  // make a query for each market based on marketid
  handleGetMarket = async () => {
    // get market according to id
    const input = {
      id: this.props.marketId
    }
    const result = await API.graphql(graphqlOperation(getMarket, input ))
    console.log(result);

    // use callback to setState to check marketowner
    this.setState({ market: result.data.getMarket, isLoading: false}, () => {
      this.checkMarketOwner() 
    });
    
  };

  // is checkMarketOwner should run immediately after setting state in handleGetMarket
  // is currently auth user the marketowner?
  checkMarketOwner = () => {
    // pass user data through props from App.js along with marketId
    const { user}  = this.props;
    const { market } = this.state;
    // update isMarketOwner if user is the currently authenticated user
    if( user ){
      this.setState({ isMarketOwner: user.username === market.owner });
    }
  }
  
  // display marketId that we passed through props
  render() {
    // destructure from state
    const { market, isLoading, isMarketOwner } = this.state;

  {/* return markup only if isLoading is set to false */}
    return isLoading ? (
      <Loading fullscreen={true} />
    ) : (
      <>
      {/* Back Button */}
       <Link className="link" to="/">
        Back to Markets List
       </Link>

       {/* Market MetaData */}
       <span className="items-center ppt-2">
        <h2 className="mb-mr">{market.name}</h2>- {market.owner}
       </span>

       <div className="items-center pt-2">
        <span style= {{ color: 'var(--lightSquidInk)', paddingBottom: "1em"}}>
          <Icon name="date" className="icon" />
          {market.createdAt}
          </span>
       </div>

       {/*  New Product */}
       <Tabs type="border-card" value= {isMarketOwner ? "1" : "2"}>
       {isMarketOwner && (
         <Tabs.Pane label={
           <>
           <Icon name="plus" className="icon"/>
            Add Product
           </>
         }
         name="1"
         >

         <NewProduct marketId={this.props.marketId} />

         </Tabs.Pane>
       )}
     

        {/* Products List */}
        <Tabs.Pane
          label = {
            <>
              <Icon name="menu" className="icon" />
              Products ({ market.products.items.length })
            </>
          }      
          name="2"
          >
          {/* Pane name is 2 */}

          {/* map over products*/}
          {/* <div className="product-List">
            {market.products.items.map(product => (
              <Product product={product}/>
            ))} 
          </div>*/}
        </Tabs.Pane>
        </Tabs>
      </>
    )

    
    {/*} <div>MarketPage {this.props.marketId} </div>;*/}
  }
}

export default MarketPage;
