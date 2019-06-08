import React from "react";
import {API, graphqlOperation } from 'aws-amplify';
import { searchMarkets } from '../graphql/queries';
import NewMarket from '../components/NewMarket';
import MarketList from '../components/MarketList';

class HomePage extends React.Component {
  state = {
    searchTerm: "",
    searchResults: [], 
    isSearching: false
  };

  handleSearchChange = searchTerm => this.setState({ searchTerm })

  handleClearSearch = () => this.setState({ searchTerm: "", searchResults: [] })

  handleSearch = async event => {
    try {
      event.preventDefault();
      console.log(this.state.searchTerm);
      this.setState({ isSearching: true })
      const results = await API.graphql(graphqlOperation(searchMarkets, {
        filter: {
          or: [
            { name: { match: this.state.searchTerm }},
            { owner: { match: this.state.searchTerm }},
            { tags: { match: this.state.searchTerm }}
          ]
        },
        sort: {
          field: "createdAt",
          direction: "desc"
        }
      }))
      console.log({ results});
      console.log(results.data.searchMarkets.items.length);
      // put search results into state and pass down to MarketList
      // as a prop -- searchResults
      this.setState({
        searchResults: results.data.searchMarkets.items,
       
        isSearching: false
      })
    } catch(err){
      console.error(err);
    }

  };

  render() {
    return (
      <>
        <NewMarket
          searchTerm = {this.state.searchTerm}
          isSearching = {this.state.isSearching}
          handleSearchChange = {this.handleSearchChange}
          handleClearSearch = {this.handleClearSearch}
          handleSearch = {this.handleSearch}
        />

        <MarketList searchResults = {this.state.searchResults} searchTerm = {this.state.searchTerm}/> 
      </>
    )
  }
}

export default HomePage;
