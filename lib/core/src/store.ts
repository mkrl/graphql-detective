import { atom, batched } from 'nanostores'

type FieldStore = {
  [queryName: string]: Set<string>
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

// Debugging
// @ts-ignore
window.$usageStore = $usageStore
// @ts-ignore
window.$queryStore = $queryStore
// @ts-ignore
window.$unusedQueryFields = $unusedQueryFields
