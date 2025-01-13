import type {
  DefinitionNode,
  DocumentNode,
  FragmentDefinitionNode,
} from 'graphql'

export type Fragments = {
  [key: string]: FragmentDefinitionNode
}

export const getFields = (
  fieldPaths: Array<string>,
  parentPath: string,
  fragments: Fragments,
  node: DefinitionNode,
) => {
  if (node?.kind === 'Field') {
    fieldPaths.push(parentPath + (parentPath ? '.' : '') + node?.name?.value)
  }

  if (node.kind === 'FragmentSpread') {
    const fragment = fragments[node?.name?.value]

    getFields(fieldPaths, parentPath, fragments, fragment)
  } else {
    node?.selectionSet?.selections?.forEach((childNode) => {
      let newParent = ''

      if (node?.kind === 'Field') {
        newParent = parentPath + (parentPath ? '.' : '') + node?.name?.value
      } else {
        newParent = parentPath
      }

      getFields(fieldPaths, newParent, fragments, childNode)
    })
  }
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
