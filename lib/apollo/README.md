<h1 align="center">@graphql-detective/apollo</h1>

<p align="center">Apollo GraphQL bindings for `graphql-detective`.</p>


## Installation

```bash
pnpm add @graphql-detective/apollo
```
or
```bash
npm i @graphql-detective/apollo
```
or
```bash
yarn add @graphql-detective/apollo
```

<hr>

When constructing your Apollo client, add `detectiveLink` as a last link in the chain right before `httpLink`:

```ts
import { detectiveLink } from '@graphql-detective/apollo'
import {
    ApolloClient,
    ApolloProvider,
    HttpLink,
    InMemoryCache,
    from,
} from '@apollo/client'

// ...

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

// ...
// Pass down the client to the ApolloProvider (differs by framework)
// <ApolloProvider client={client}>
```

Please note that the cache MUST be disabled (this might change in the future). If you have a custom fetch policy, you can set it to `no-cache`.

## Tracking

After `graphql-detective` is correctly plugged into your link chain, it will start tracking every single query and mutation that is being executed.

Please note, usage records are sourced directly from accessing properties at runtime. This means that if somewhere in your code you conditionally access a field, it will be tracked as used only if the condition is met. This is why for complex setups it is recommended to either go through a user flow or run an automated test with the tracking enabled.

<hr>

After you feel like you have recorded enough, you can access unused records by calling the following function in the browser console:

```js
$unusedQueryFields.get()
```

You can also access usage records and parsed GQL documents with

```js
$queryStore.get()
$usageStore.get()
```

That is only temporary and will be replaced with a more user-friendly interface in the future.