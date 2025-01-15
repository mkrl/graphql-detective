import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  from,
} from '@apollo/client'
import { detectiveLink } from '@graphql-detective/apollo'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

const httpLink = new HttpLink({
  uri: 'https://flyby-router-demo.herokuapp.com/',
})

const client = new ApolloClient({
  link: from([detectiveLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    // Cache MUST be disabled for the detective to work
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
})

const rootEl = document.getElementById('root')
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl)
  root.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </React.StrictMode>,
  )
}
