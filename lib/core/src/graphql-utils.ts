import type {
  DocumentNode,
  FragmentDefinitionNode,
  OperationDefinitionNode,
  SelectionNode,
} from 'graphql'
import { Kind } from 'graphql'
import { PATH_SEPARATOR } from './proxy.ts'

export type Fragments = {
  [key: string]: FragmentDefinitionNode
}
export type ParsableNode =
  | SelectionNode
  | OperationDefinitionNode
  | FragmentDefinitionNode

// Parsing an existing document node to return a set of field addresses (i.e. 'author.posts.title')
export const getQueryFields = (docNode: ParsableNode, fragments: Fragments) => {
  const fields = new Set<string>()

  const extractField = (parentPath: string, node: ParsableNode) => {
    if (node.kind === Kind.FIELD && node.name.value !== '__typename') {
      fields.add(parentPath + (parentPath ? '.' : '') + node.name.value)
    }
    if (node.kind === Kind.FRAGMENT_SPREAD) {
      const fragment = fragments[node?.name?.value]

      extractField(parentPath, fragment)
    } else {
      node.selectionSet?.selections.forEach((childNode) => {
        let newParent = ''

        if (
          (childNode.kind === Kind.FIELD ||
            childNode.kind === Kind.INLINE_FRAGMENT) &&
          node.kind !== Kind.INLINE_FRAGMENT &&
          node.kind !== Kind.FRAGMENT_DEFINITION &&
          // This condition is here so operation names (query names) are not included in the path
          node.kind !== Kind.OPERATION_DEFINITION
        ) {
          newParent =
            parentPath + (parentPath ? PATH_SEPARATOR : '') + node.name?.value
        } else {
          newParent = parentPath
        }

        extractField(newParent, childNode)
      })
    }
  }
  extractField('', docNode)

  return fields
}

// Extract fragments from a DocumentNode so they can later be used to parse it
export const getFragments = (query: DocumentNode) => {
  const fragments: Fragments = {}

  query.definitions
    .filter((definition) => definition.kind === 'FragmentDefinition')
    .forEach((fragment) => {
      fragments[fragment.name.value] = fragment
    })

  return fragments
}

export const getQueryName = (operation: OperationDefinitionNode) =>
  operation.name?.value

export const parseDocumentNode = (
  node: DocumentNode,
): [string, Set<string>] => {
  const fragments = getFragments(node)
  const firstOperationNode = node.definitions.find(
    (definition) => definition.kind === Kind.OPERATION_DEFINITION,
  )
  if (!firstOperationNode) {
    throw new Error('No operation definition found in the document node')
  }
  const queryName = getQueryName(firstOperationNode)
  if (!queryName) {
    throw new Error('Unnamed query found in the document node')
  }
  return [queryName, getQueryFields(firstOperationNode, fragments)]
}
