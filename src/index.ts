import {proxyTrackData} from "./proxy.ts";
import { graphql, parse } from 'graphql'
import { addMocksToSchema } from '@graphql-tools/mock'
import { makeExecutableSchema } from '@graphql-tools/schema'

// Fill this in with the schema string
const schemaString = `
  type Author {
    id: Int!
    firstName: String
    lastName: String
    posts: [Post]
  }
 
  type Post {
    id: Int!
    title: String
    author: Author
    votes: Int
  }
 
  type Query {
    posts: [Post]
    author(id: Int!): Author
  }
 
  type Mutation {
    upvotePost(postId: Int!): Post
  }
`
const schema = makeExecutableSchema({ typeDefs: schemaString })

const schemaWithMocks = addMocksToSchema({ schema })

const query = /* GraphQL */ `
  query tasksForUser {
    author(id: 6) {
      id
      firstName
      posts {
        title
        votes
      }
    }
  }
`

graphql({
    schema: schemaWithMocks,
    source: query
}).then(result => {
    const data = proxyTrackData(result.data, console.log)
    const a = data.author.posts[0].votes
    const b = data.author.firstName
})