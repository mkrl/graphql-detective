import { ApolloLink } from '@apollo/client'
import {
  initUsage,
  parseDocumentNode,
  proxyTrackData,
  recordQuery,
  trackUsage,
} from '@graphql-detective/core'

export const detectiveLink = new ApolloLink((operation, forward) => {
  /* Nothing to do before server returns the response */

  return forward(operation).map((response) => {
    // Called after server responds
    const { data } = response
    const fields = parseDocumentNode(operation.query)
    recordQuery(operation.operationName, fields)
    initUsage(operation.operationName)

    return {
      data: proxyTrackData(data, (path) => {
        trackUsage(operation.operationName, path)
      }),
    }
  })
})
