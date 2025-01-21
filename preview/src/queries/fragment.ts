export const fragmentQuery = `
    query getAuthor {
      author(id: 6) {
        ...authorDetails
        id
        posts {
          title
          id
        }
      }
    }
    fragment authorDetails on Author {
      firstName
      lastName
    }
`
