export const fragmentQuery = `
    query getProposalWithFragment {
      proposal(id: 6) {
        ...proposalDetails
        id
      }
    }
    fragment proposalDetails on Proposal {
      champions
      stage
    }
`
