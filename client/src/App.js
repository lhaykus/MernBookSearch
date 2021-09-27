import React from 'react';
//Import ApolloServer
import {ApolloClient, InMemoryCache, ApolloProvider, createHttpLink} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

//Create main graphQl API endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

//Request middleware that will attach token to every request
const authLink = setContext((_, { headers }) => {
  //get authentication token from local storage
  const token = localStorage.getItem('id_token');
  //return headers to context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer${token}` : '',
    },
  };
});

//Set up client to execute the middleware before making GraphQL API request
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    //Wrap with ApolloProvider
    <ApolloProvider client={client}>
    <Router>
      <>
        <Navbar />
        <Switch>
          <Route exact path='/' component={SearchBooks} />
          <Route exact path='/saved' component={SavedBooks} />
          <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
        </Switch>
      </>
    </Router>
    </ApolloProvider>
  );
}

export default App;
