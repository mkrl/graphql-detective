import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  from,
} from '@apollo/client'
import { detectiveLink } from '@graphql-detective/apollo'
import { ApolloComponent } from './ApolloComponent.tsx'

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

export const ApolloApp = () => (
  <ApolloProvider client={client}>
    <ApolloComponent />
  </ApolloProvider>
)
