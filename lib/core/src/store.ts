import { atom, batched } from 'nanostores'
import { dset } from 'dset'

type FieldStore = {
  [queryName: string]: Set<string>
}

export type UsageSchema = {
  [key: string]: boolean | UsageSchema
}

export const $usageStore = atom<FieldStore>({})
export const $queryStore = atom<FieldStore>({})

export const initUsageStoreForQuery = (queryName: string) => {
  $usageStore.set({
    ...$queryStore.get(),
    [queryName]: new Set<string>(),
  })
}

export const trackUsage = (queryName: string, path: string) => {
  $usageStore.set({
    ...$usageStore.get(),
    [queryName]: new Set([...$usageStore.get()[queryName], path]),
  })
}

export const recordQuery = (queryName: string, set: Set<string>) => {
  $queryStore.set({
    ...$queryStore.get(),
    [queryName]: set,
  })
}

export const $unusedQueryFields = batched(
  [$usageStore, $queryStore],
  (usages, fields) => {
    return Object.fromEntries(
      Object.keys(fields).map((queryName) => [
        queryName,
        fields[queryName].difference(usages[queryName]),
      ]),
    )
  },
)

export const $usageSchema = batched(
  [$unusedQueryFields, $queryStore],
  (unusedFields, queries) => {
    const querySchema: UsageSchema = {}
    Object.keys(queries).forEach((queryName) => {
      queries[queryName].forEach((field) => {
        dset(
          querySchema,
          `${queryName}.${field}`,
          !unusedFields[queryName].has(field),
        )
      })
    })
    return querySchema
  },
)

// Debugging
// @ts-ignore
window.$usageStore = $usageStore
// @ts-ignore
window.$queryStore = $queryStore
// @ts-ignore
window.$unusedQueryFields = $unusedQueryFields
// @ts-ignore
window.$usageSchema = $usageSchema
