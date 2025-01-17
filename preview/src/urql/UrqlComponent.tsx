import '../App.css'
import { gql, useQuery } from 'urql'

const GET_AUTHOR = gql`
    query Author {
      author(id: 6) {
        firstName
        id
        lastName
        posts {
          title
          id
        }
      }
    }
`

export const UrqlComponent = () => {
  const [result] = useQuery({ query: GET_AUTHOR })

  const { data, fetching, error } = result
  return (
    <div className="content">
      <h1>GraphQL Detective @ Apollo</h1>
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
