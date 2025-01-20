export const defaultQuery = `
    query getAuthor {
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
