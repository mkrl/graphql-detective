import '../App.css'
import { gql, useQuery } from 'urql'
import { defaultQuery } from '../queries/default.ts'
import { fragmentQuery } from '../queries/fragment.ts'
import { inlineFragmentQuery } from '../queries/inlineFragment.ts'

const GET_AUTHOR = gql(inlineFragmentQuery)

export const UrqlComponent = () => {
  const [result] = useQuery({ query: GET_AUTHOR })

  const { data, fetching } = result
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
