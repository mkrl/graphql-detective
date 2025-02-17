<h1 align="center">@graphql-detective/urql</h1>

<p align="center">urql bindings for `graphql-detective`.</p>


## Installation

```bash
pnpm add @graphql-detective/urql
```
or
```bash
npm i @graphql-detective/urql
```
or
```bash
yarn add @graphql-detective/urql
```

<hr>

When constructing your urql client, add `detectiveExchange` as a last exchange in the chain right before `fetchExchange`:

```ts
import { detectiveExchange } from '@graphql-detective/urql'
import { Client, Provider, fetchExchange } from 'urql'

// ...

const client = new Client({
    url: 'endpoint_url',
    exchanges: [detectiveExchange, fetchExchange],
})

// ...
// Pass down the client to the urql provider (differs by framework)
// <Provider client={client}>
```

## Tracking

After `graphql-detective` is correctly plugged into your exchange chain, it will start tracking every single query and mutation that is being executed.

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