import '../App.css'
import { gql, useQuery } from '@apollo/client'

const GET_LOCATIONS = gql`
  query GetLocations {
    locations {
      id
      name
      description
      photo
    }
  }
`

export const ApolloComponent = () => {
  const { loading, data } = useQuery(GET_LOCATIONS)
  return (
    <div className="content">
      <h1>GraphQL Detective @ Apollo</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {data.locations.map((location) => (
            <li key={location.id}>{location.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
