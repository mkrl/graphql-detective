import '../App.css'
import { gql, useQuery } from 'urql'
import { defaultQuery } from '../queries/default.ts'
import { fragmentQuery } from '../queries/fragment.ts'
import { inlineFragmentQuery } from '../queries/inlineFragment.ts'

const DEFAULT_QUERY = gql(defaultQuery)
const FRAGMENT_QUERY = gql(fragmentQuery)
const INLINE_FRAGMENT_QUERY = gql(inlineFragmentQuery)

export const UrqlComponent = () => {
  const [{ fetching, data }] = useQuery({ query: DEFAULT_QUERY })
  const [{ fetching: fragmentFetching, data: dataFragment }] = useQuery({
    query: FRAGMENT_QUERY,
  })
  const [{ fetching: inlineFetching, data: dataInline }] = useQuery({
    query: INLINE_FRAGMENT_QUERY,
  })

  return (
    <>
      <h1>GraphQL Detective @ Urql</h1>
      <div className="row">
        <div>
          <h2>Default Query</h2>
          {fetching ? <p>Loading...</p> : <>{data.champion.name}</>}
        </div>
        <div>
          <h2>Fragment Query</h2>
          {fragmentFetching ? (
            <p>Loading...</p>
          ) : (
            <>
              {dataFragment.proposal.id}
              {dataFragment.proposal.stage}
              {dataFragment.proposal.champions[0]}
            </>
          )}
        </div>
        <div>
          <h2>Inline Fragment Query</h2>
          {inlineFetching ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {dataInline.author.id}
              {dataInline.author.posts.map((post) => (
                <li key={post.id}>{post.title}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}
