import React from "react";
import { graphqlOperation } from 'aws-amplify';
import { Connect } from 'aws-amplify-react';
import { listMarkets } from '../graphql/queries';
import { onCreateMarket } from '../graphql/subscriptions';
import { Loading, Card, Icon, Tag } from "element-react";
import Error from './Error';
import { Link } from 'react-router-dom';

/* How do we get data? 
  MarketList is coming from connect query or from props.
  get searchResults destructured from props on MarketList component on HomePage.js
*/
const MarketList = ({ searchResults, searchTerm }) => {

  console.log(' ml '+searchResults.length);
  const onNewMarket = (prevQuery, newData) => {
     // shallow copy of data by spreading all of the properties and values of prevquery into a new object
     let updatedQuery = { ...prevQuery };
     // create new array which combines prevQuery and newData
     const updatedMarketList  = [
       newData.onCreateMarket, // add newly created market from our create market subscription which is the first array element
       ...prevQuery.listMarkets.items // get old market data
     ]
     // swap out updated query items with new array, updatedMarketList
     updatedQuery.listMarkets.items = updatedMarketList;
     return updatedQuery;
  }

  return (

    <Connect
      // get data, loading, errors from query 
      query={graphqlOperation(listMarkets)}
      // subscribe to changes in our data
      subscription={graphqlOperation(onCreateMarket)}
      // get access to new data when a new market is created
      onSubscriptionMsg={onNewMarket}
    >
    {/* Connect uses the render props pattern. {(values)} */}
     {({data, loading, errors}) => {
        if(errors.length > 0)  return  <Error errors={errors}/>
        
        if( loading || !data.listMarkets ) return <Loading fullscreen={true}/>

        const markets = searchResults.length > 0 ? searchResults : data.listMarkets.items;
   
        return (
          <>
              {/* 
          If we have any searchResults we display a different header.
          using a ternary expression --
          if we have searchResults then display number of searchResults
          else if we don't have any searchResults just show normal header */}
          { searchResults.length > 0 ? (
            <h2 className="text-green"> <Icon type="success" name="check" className="icon" />
              {searchResults.length} Results for {searchTerm}
            </h2>
          ) :
          (<h2 className="header">
            <img src ="https://icon.now.sh/store_mall_directory/527FFF" 
            alt="Store Icon" className="large-icon"/> 
            Markets
          </h2>)} 
          
          {/* markets array  */}
          {console.log(data.listMarkets.items)}
              {markets.map(market => (
                
                <div key={market.id} className="my-2">
                  <Card
                    bodyStyle = {{
                      padding: "0.7em",
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <span className="flex">
                        <Link className="link" to={`/markets/${market.id}`}>
                          {market.name}
                        </Link>
                        <span style={{ color: "var(--darkAmazonOrange)" }}>
                          {/* { market.products.items.length} */}
                    
                        </span>
                        <img src="https://icon.now.sh/shopping_cart/f60" alt="Shopping Cart"/>
                      </span>
                      <div style={{ color: "var(--lightSquidInk"}}>
                        {market.owner}
                      </div>
                      </div>
                      <div>
                        {market.tags && market.tags.map(tag => (
                        <Tag key={tag} type="danger" className="mx-1">
                          {tag}
                        </Tag>
                      ))}
                    </div>
                   </Card>
                  
                </div>
             
              
              ))}
          </>
        ); {/*  close return */}
      }} 
      {/* close data, loding, errors from Connect query */}
   </Connect>
  )
}


// function component 
// const MarketList = () => {
//   return <div>MarketList</div>;
// };

export default MarketList;
