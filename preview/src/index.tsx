import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApolloApp } from './apollo/ApolloApp.tsx'
import { UrqlApp } from './urql/UrqlApp.tsx'

const rootEl = document.getElementById('root')
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl)
  root.render(
    <React.StrictMode>
      {/*<ApolloApp />*/}
      <UrqlApp />
    </React.StrictMode>,
  )
}
