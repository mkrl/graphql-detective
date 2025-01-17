import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { addMocksToSchema } from '@graphql-tools/mock'
import { makeExecutableSchema } from '@graphql-tools/schema'

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

const server = new ApolloServer({
  schema: addMocksToSchema({
    schema: schemaWithMocks,
  }),
})

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } })

console.log(`🚀 Server listening at: ${url}`)
