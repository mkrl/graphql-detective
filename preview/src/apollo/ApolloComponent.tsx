import '../App.css'
import { gql, useQuery } from '@apollo/client'
import { defaultQuery } from '../queries/default.ts'
import { fragmentQuery } from '../queries/fragment.ts'

const GET_LOCATIONS = gql(fragmentQuery)

export const ApolloComponent = () => {
  const { loading, data } = useQuery(GET_LOCATIONS)
  return (
    <div className="content">
      <h1>GraphQL Detective @ Apollo</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {data.author.posts.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
