import React from "react";
import { API, graphqlOperation } from 'aws-amplify';
// import { getMarket } from '../graphql/queries';
import { onCreateProduct, onUpdateProduct, onDeleteProduct } from '../graphql/subscriptions';
import { Loading, Tabs, Icon } from "element-react";
import { Link } from 'react-router-dom';
import NewProduct from '../components/NewProduct';
import Product from '../components/Product';

const getMarket = `query GetMarket($id: ID!) {
  getMarket(id: $id) {
    id
    name
    products {
      items {
        id
        description
        price
        shipped
        owner
        file {
          key
        }
        createdAt
      }
      nextToken
    }
    tags
    owner
    createdAt
  }
}
`;

class MarketPage extends React.Component {
  state = {
    market: null,
    isLoading: true, // when we visit market page, data is loading
    isMarketOwner: false // if not the owner display products the owner created. 
    // if the owner display tab to add new products.
  };

  componentDidMount() {
    this.handleGetMarket();
    // onCreateProduct Subscription
    // setup Subscriptions -- setup reference on this so that we can unmount later if needed
    this.createProductListner = API.graphql(graphqlOperation(onCreateProduct))
    .subscribe({
      next: productData => {  

        // when a new product is created
        const createProduct = productData.value.data.onCreateProduct;
        // separate createdProduct from all the previous Products.
        // Iterate over previous products to make sure that none have the
        // same id as the newly created Product id
        const prevProducts = this.state.market.products.items.filter(
          item => item.id !== createProduct.id
        )
        // createdProduct is the first element in new array
        const updatedProducts = [createProduct, ...prevProducts]
        // shallow clone of market
        const market = { ...this.state.market };
        // 
        market.products.items = updatedProducts;
        // set state with updated market
        this.setState({ market });
      }
    })

    // update product listener by executing onUpdateProduct subscription
    this.updateProductListener = API.graphql(graphqlOperation(onUpdateProduct))
    .subscribe({
      // get productData when ever a product is updated
      next: productData => {
        const updatedProduct = productData.value.data.onUpdateProduct
        // find index of updated product
        const updatedProductIndex = this.state.market.products.items.findIndex(
          item => item.id === updatedProduct.id
        )    
      const updatedProducts = [
        // spread in products to get all of the array before the updated product
        // slice in 0th index into updatedProductIndex
        ...this.state.market.products.items.slice(0, updatedProductIndex),
        updatedProduct,
        // spread in the rest of the array
        ...this.state.market.products.items.slice(updatedProductIndex + 1)
      ]
       // shallow clone of market
       const market = { ...this.state.market };
       // update items property with updateProducts array
       market.products.items = updatedProducts;
       // set state with updated market
       this.setState({ market });
    }
    })
    // delete product subscription
    this.deleteProductListner = API.graphql(graphqlOperation(onDeleteProduct))
    .subscribe({
      next: productData => {  
        // when a new product is created
        const deletedProduct = productData.value.data.onDeleteProduct;
        // separate createdProduct from all the previous Products.
        // Iterate over previous products to make sure that none have the
        // same id as the newly created Product id
        const deletedProducts = this.state.market.products.items.filter(
          item => item.id !== deletedProduct.id
        )
        // createdProduct is the first element in new array
        // const updatedProducts = [createProduct, ...prevProducts]
        // shallow clone of market
        const market = { ...this.state.market };
        // 
        market.products.items = deletedProducts;
        // set state with updated market
        this.setState({ market });
      }
    })
  }
 
   componentWillUnmount() {
     this.createProductListener.unsubscribe();
     this.updateProductListener.unssubscribe();
     this.deleteProductListener.unsubscribe();
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
          <div className="product-List">
            {market.products.items.map(product => (
              <Product key={product.id} product={product}/>
            ))} 
          </div>
        </Tabs.Pane>
        </Tabs>
      </>
    )

    
    {/*} <div>MarketPage {this.props.marketId} </div>;*/}
  }
}

export default MarketPage;
