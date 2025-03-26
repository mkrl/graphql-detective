<h1 align="center">graphql-detective</h1>

<p align="center">Track unused fields in your GraphQL queries at runtime</p>


## Installation

The core package is framework-agnostic, but specific to a GraphQL client you use.

Please see the corresponding docs for the client you are using:

- [Apollo](./lib/apollo/README.md)
- [Urql](./lib/urql/README.md)

## Why?

When working with GraphQL on a scale, it is easy to lose track of which fields are actually being used in your application. This usually leads to over-fetching and performance issues.

Static analysis and good type-safe code generation can certainly help, but in a lot of cases like dynamic queries, object spreads and destructuring, or passing objects as props, it is not always possible to know which fields are actually being accessed at runtime.

Yes, you heard this right, this is not a static analysis tool.

## How?

Proxies! The basic idea is very simple and was around for quite some time.

When data comes back from the GraphQL endpoint, we take the entire data object, and recursively traverse it to create a tracking proxy. The app then receives the proxied object instead of the original data.

In the meantime, we also parse the GraphQL query document and store the representation of all potential usage paths.

When the app accesses a field on the proxied object, we record the accessed path.

Finally, when we want to know which fields are unused, we compare the accessed paths with the potential usage paths.

While this idea was talked about a while ago (see [Reddit Engineering Blog](https://www.reddit.com/r/RedditEng/comments/x0rasj/identifying_unused_fields_in_graphql/)), it was never released as an open-source solution.

## Disclaimer

This is NOT intended to be used in production. This should never end up in your final bundle, you set it up, test your suspicions, and roll it back.

Very early in development, but somewhat battle-tested in a few pretty big codebases.
