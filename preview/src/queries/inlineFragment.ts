export const inlineFragmentQuery = `
    query getAuthorWithInlineFragment {
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
