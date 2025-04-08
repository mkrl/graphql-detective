import '../App.css'
import { gql, useQuery } from '@apollo/client'
import { defaultQuery } from '../queries/default.ts'
import { fragmentQuery } from '../queries/fragment.ts'
import { inlineFragmentQuery } from '../queries/inlineFragment.ts'

const DEFAULT_QUERY = gql(defaultQuery)
const FRAGMENT_QUERY = gql(fragmentQuery)
const INLINE_FRAGMENT_QUERY = gql(inlineFragmentQuery)

export const ApolloComponent = () => {
  const { loading, data } = useQuery(DEFAULT_QUERY)
  const { loading: fragmentLoading, data: dataFragment } =
    useQuery(FRAGMENT_QUERY)
  const { loading: inlineLoading, data: dataInline } = useQuery(
    INLINE_FRAGMENT_QUERY,
  )

  return (
    <>
      <h1>GraphQL Detective @ Apollo</h1>
      <div className="row">
        <div>
          <h2>Default Query</h2>
          {loading ? <p>Loading...</p> : <>{data.champion.name}</>}
        </div>
        <div>
          <h2>Fragment Query</h2>
          {fragmentLoading ? (
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
          {inlineLoading ? (
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
