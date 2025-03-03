import { ApolloLink } from '@apollo/client'
import {
  initUsageStoreForQuery,
  parseDocumentNode,
  proxyTrackData,
  recordQuery,
  trackUsage,
} from '@graphql-detective/core'

export const detectiveLink = new ApolloLink((operation, forward) => {
  /* Nothing to do before server returns the response */
  /* Perhaps there is a way to reset cache policy from here? */

  return forward(operation).map((response) => {
    // Called after server responds
    const { data } = response
    const [, fields] = parseDocumentNode(operation.query)
    recordQuery(operation.operationName, fields)
    initUsageStoreForQuery(operation.operationName)

    return {
      data: proxyTrackData(data, (path) => {
        trackUsage(operation.operationName, path)
      }),
    }
  })
})
