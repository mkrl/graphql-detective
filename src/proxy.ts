import { trimDots } from './utils.ts'

type TrackCallback = (path: string) => void

type ObjectWithPaths<TargetType> = {
  nodePath: string
} & TargetType

const PATH_SEPARATOR = '.'

const EXCLUDED_PROPS = ['__typename', 'nodePath', 'length']

// Getting rid of array indexes in paths (foo.1.bar)
export const removeArrayIndex = (path: string) => {
  const denumberedString = path.replace(/\d+\.?/gm, '')

  return trimDots(denumberedString)
}

// Recursively adding paths (.nodePath property) to each Object node in the target (i.e. foo.bar.baz)
export const addPaths = <TargetType>(
  target: TargetType,
  path = '',
): ObjectWithPaths<TargetType> => {
  if (typeof target === 'object' && target !== null) {
    target.nodePath = path
    for (const property in target) {
      const newPath = path.length
        ? `${path}${PATH_SEPARATOR}${property}`
        : property
      addPaths(target[property], newPath)
    }
  }

  return target
}

export const attachProxy = <TargetType>(
  target: ObjectWithPaths<TargetType>,
  tracker: TrackCallback,
): TargetType => {
  const handler = {
    get(target: TargetType, key: string) {
      if (typeof target[key] === 'object' && target[key] !== null) {
        tracker(removeArrayIndex(target[key].nodePath))

        return new Proxy(target[key], handler)
      }
      if (
        // Excluding built-in methods
        Object.prototype.hasOwnProperty.call(target, key) &&
        // Excluding props like "__typename"
        !EXCLUDED_PROPS.includes(key)
      ) {
        tracker(removeArrayIndex(`${target.nodePath}${PATH_SEPARATOR}${key}`))
      }
      return Reflect.get(...arguments)
    },
  }

  return new Proxy(target, handler)
}

export const proxyTrackData = <TargetType>(
  obj: TargetType,
  tracker: TrackCallback,
) => {
  return attachProxy(addPaths(structuredClone(obj)), tracker) as TargetType
}
