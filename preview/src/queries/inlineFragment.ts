export const inlineFragmentQuery = `
    query getAuthor {
      author(id: 6) {
        identity {
            ... on Human {
                totalFingers
            }
            ... on Android {
                totalCores
            }
        } 
        id
        posts {
          title
          id
        }
      }
    }
`
