<h1 align="center">graphql-detective</h1>

<p align="center">Track unused fields in your GraphQL queries at runtime</p>

## Why?

When working with GraphQL on a scale, it is easy to lose track of which fields are actually being used in your application. This usually leads to over-fetching and performance issues. 


Yes, you heard this right, this is not a static analysis tool. While there are several fantastic solutions for static analysis out there, it is not a 100% reliable way to know which fields are ACTUALLY accessed at runtime. This is because static analysis can't always infer things like object spreads, passing objects as props or conditionally constructing new data.

## How?

Proxies! The basic idea is very simple and was around for quite some time.

When data comes back from the GraphQL endpoint, we take the entire data object, and recursively traverse it to create a tracking proxy. The app then recieves the proxied object instead of the original data.

In the meantime, we also parse the GraphQL query document and store the representation of all potential usage paths.

When the app accesses a field on the proxied object, we record the accessed path.

Finally, when we want to know which fields are unused, we compare the accessed paths with the potential usage paths.

While this idea was talked about a while ago (see [Reddit Engineering Blog](https://www.reddit.com/r/RedditEng/comments/x0rasj/identifying_unused_fields_in_graphql/)), it was never released as an open-source solution.

## Disclaimer

This is NOT intended to be used in production. This should never end up in your final bundle, you set it up, test your suspicions, and remove it. 

Very early in development, but somewhat battle-tested in a few massive codebases.

## Installation

The core package is framework-agnostic, but specific to a GraphQL client you use.

Please see the corresponding documents for the client you are using:

- [Apollo](./lib/apollo/README.md)
- [Urql](./lib/urql/README.md)