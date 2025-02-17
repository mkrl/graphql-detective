import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { ApolloApp } from './apollo/ApolloApp.tsx'
import { UrqlApp } from './urql/UrqlApp.tsx'

const renderApp = () => {
  const env = import.meta.env.PUBLIC_CLIENT
  if (env === 'apollo') {
    return <ApolloApp />
  }
  if (env === 'urql') {
    return <UrqlApp />
  }
  return <ApolloApp />
}

const rootEl = document.getElementById('root')

if (rootEl) {
  const root = ReactDOM.createRoot(rootEl)
  root.render(
    <StrictMode>
      <div className="content">
        <img src="./detective_logo.svg" alt="Graphql Detective logo" />
        {renderApp()}
      </div>
    </StrictMode>,
  )
}
