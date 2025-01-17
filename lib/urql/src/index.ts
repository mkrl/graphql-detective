import {
  initUsage,
  parseDocumentNode,
  proxyTrackData,
  recordQuery,
  trackUsage,
} from '@graphql-detective/core'
import type { Exchange, Operation, OperationResult } from 'urql'
import { filter, map, merge, pipe, tap } from 'wonka'
import type { Source } from 'wonka'

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
          const fields = parseDocumentNode(op.operation.query)
          // @TODO: properly extract query name from DocumentNode
          recordQuery('someQuery', fields)
          initUsage('someQuery')

          return {
            ...op,
            data: proxyTrackData(op.data, (path) =>
              trackUsage('someQuery', path),
            ),
          }
        }
        return op
      }),
    )
