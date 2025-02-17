# Graphql Detective Preview

Fiddle around and test various integrations with different client frameworks.

## Setup

Node 23+ is required to run the graphql mock server (yes, you can finally directly run `.ts` files!).

Install the dependencies:

```bash
pnpm install
```

## Get Started

Start the dev server depending on the client framework:

```bash
pnpm apollo
```
or
```bash
pnpm urql
```

When making code changes outside the preview scope (for example, in `/libs/core`), be sure to rebuild the dependencies from the root directory:

```bash
pnpm build:lib
```
