// import { addMocksToSchema } from '@graphql-tools/mock'
// import { makeExecutableSchema } from '@graphql-tools/schema'
// import { graphql, parse } from 'graphql'
// import { getFragments, getQueryFields } from './graphql-utils.ts'
// import { proxyTrackData } from './proxy.ts'
//
// // Fill this in with the schema string
// const schemaString = `
//   type Author {
//     id: Int!
//     firstName: String
//     lastName: String
//     posts: [Post]
//   }
//
//   type Post {
//     id: Int!
//     title: String
//     author: Author
//     votes: Int
//   }
//
//   type Query {
//     posts: [Post]
//     author(id: Int!): Author
//   }
//
//   type Mutation {
//     upvotePost(postId: Int!): Post
//   }
// `
// const schema = makeExecutableSchema({ typeDefs: schemaString })
//
// const schemaWithMocks = addMocksToSchema({ schema })
//
// const query = /* GraphQL */ `
//   query tasksForUser {
//     author(id: 6) {
//       id
//       firstName
//       posts {
//         title
//         votes
//       }
//     }
//   }
// `
//
// const usages = new Set<string>()
//
// const trackUsage = (path: string) => {
//   usages.add(path)
// }
//
// const docNode = parse(query)
// const fragments = getFragments(docNode)
// const fields = getQueryFields(docNode, fragments)
//
// graphql({
//   schema: schemaWithMocks,
//   source: query,
// }).then((result) => {
//   const data = proxyTrackData(result.data, trackUsage)
//   const a = data.author.posts[0].votes
//   const b = data.author.firstName
//
//   const diff = fields.difference(usages)
//   console.log(diff)
// })

export { proxyTrackData } from './proxy.ts'
export { parseDocumentNode } from './graphql-utils.ts'
export {
  $usageStore,
  $queryStore,
  $unusedQueryFields,
  recordQuery,
  trackUsage,
  initUsage,
} from './store.ts'
