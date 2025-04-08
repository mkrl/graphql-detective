import {
  createDetectiveUI,
  initUsageStoreForQuery,
  parseDocumentNode,
  proxyTrackData,
  recordQuery,
  trackUsage,
} from '@graphql-detective/core'
import type { Exchange, OperationResult } from 'urql'
import { map, pipe } from 'wonka'

const isProcessed = (result: OperationResult) => {
  const { operation, data } = result
  if (!operation) return false
  if (!data) return false
  if (operation.kind === 'query') return true
  return false
}

export const detectiveExchange: Exchange =
  ({ forward }) =>
  (operations$) =>
    pipe(
      operations$,
      forward,
      map((op) => {
        if (isProcessed(op)) {
          const [queryName, fields] = parseDocumentNode(op.operation.query)
          recordQuery(queryName, fields)
          initUsageStoreForQuery(queryName)
          createDetectiveUI()

          return {
            ...op,
            data: proxyTrackData(op.data, (path) =>
              trackUsage(queryName, path),
            ),
          }
        }
        return op
      }),
    )
