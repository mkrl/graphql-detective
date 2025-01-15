import type {
  DocumentNode,
  FragmentDefinitionNode,
  OperationDefinitionNode,
  SelectionNode,
} from 'graphql'
import { Kind } from 'graphql'

export type Fragments = {
  [key: string]: FragmentDefinitionNode
}
export type ParsableNode =
  | SelectionNode
  | OperationDefinitionNode
  | FragmentDefinitionNode

export const getQueryFields = (docNode: DocumentNode, fragments: Fragments) => {
  const fields = new Set<string>()

  const extractField = (parentPath: string, node: ParsableNode) => {
    // @TODO: Add support for InlineFragmentNode
    if (node.kind === Kind.INLINE_FRAGMENT) {
      throw new Error('Inline Fragments are not yet supported')
    }
    if (node.kind === Kind.FIELD) {
      fields.add(parentPath + (parentPath ? '.' : '') + node.name.value)
    }
    if (node.kind === Kind.FRAGMENT_SPREAD) {
      const fragment = fragments[node?.name?.value]

      extractField(parentPath, fragment)
    } else {
      node?.selectionSet?.selections.forEach((childNode) => {
        let newParent = ''

        if (childNode.kind === Kind.FIELD) {
          newParent = parentPath + (parentPath ? '.' : '') + node.name?.value
        } else {
          newParent = parentPath
        }

        extractField(newParent, childNode)
      })
    }
  }
  extractField('', docNode.definitions[0] as ParsableNode)

  return fields
}

// Extract fragments from a DocumentNode so they can later be used to build a usage object
export const getFragments = (query: DocumentNode) => {
  const fragments: Fragments = {}

  query.definitions
    .filter((def) => def.kind === 'FragmentDefinition')
    .forEach((frg) => {
      fragments[frg?.name?.value] = frg
    })

  return fragments
}
