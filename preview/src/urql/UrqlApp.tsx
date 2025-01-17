import { Client, Provider, cacheExchange, fetchExchange } from 'urql'

import { detectiveExchange } from '@graphql-detective/urql'
import { UrqlComponent } from './UrqlComponent.tsx'

const client = new Client({
  url: 'http://localhost:4000/',
  exchanges: [detectiveExchange, fetchExchange],
})

export const UrqlApp = () => (
  <Provider value={client}>
    <UrqlComponent />
  </Provider>
)
