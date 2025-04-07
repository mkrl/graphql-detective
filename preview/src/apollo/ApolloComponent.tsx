import '../App.css'
import { gql, useQuery } from '@apollo/client'
import { defaultQuery } from '../queries/default.ts'
import { fragmentQuery } from '../queries/fragment.ts'
import { inlineFragmentQuery } from '../queries/inlineFragment.ts'

const GET_LOCATIONS = gql(fragmentQuery)

export const ApolloComponent = () => {
  const { loading, data } = useQuery(GET_LOCATIONS)

  return (
    <>
      <h1>GraphQL Detective @ Apollo</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {data.author.firstName}
          {data.author.id}
          {data.author.posts.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
    </>
  )
}
