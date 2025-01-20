import '../App.css'
import { gql, useQuery } from 'urql'
import { defaultQuery } from '../queries/default.ts'

const GET_AUTHOR = gql(defaultQuery)

export const UrqlComponent = () => {
  const [result] = useQuery({ query: GET_AUTHOR })

  const { data, fetching, error } = result
  return (
    <div className="content">
      <h1>GraphQL Detective @ Urql</h1>
      {fetching ? (
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
