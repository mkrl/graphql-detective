import { expect, describe, it, vi   } from 'vitest'
import { proxyTrackData } from '../src/proxy.ts'

const testObject = {
    foo: {
        bar: {
            baz: 1
        }
    },
    qux: 2,
    fred: [
        {
            plugh: 5
        }
    ]
}

describe('proxyTrackData', () => {
    it('calls tracking function when accessing proxied properties', () => {
        const tracker = vi.fn()

        const proxiedData = proxyTrackData(testObject, tracker)
        const deepNestedProperty = proxiedData.foo.bar.baz

        expect(deepNestedProperty).toBe(testObject.foo.bar.baz)

        expect(tracker).toHaveBeenCalledWith('foo')
        expect(tracker).toHaveBeenCalledWith('foo.bar')
        expect(tracker).toHaveBeenCalledWith('foo.bar.baz')
        expect(tracker).toHaveBeenCalledTimes(3)

        const arrayProperty = proxiedData.fred[0].plugh

        expect(arrayProperty).toBe(testObject.fred[0].plugh)

        expect(tracker).toHaveBeenCalledWith('fred')
        expect(tracker).toHaveBeenCalledWith('fred.plugh')
        expect(tracker).toHaveBeenCalledTimes(6)

        const directChild = proxiedData.qux

        expect(directChild).toBe(testObject.qux)
        expect(tracker).toHaveBeenCalledTimes(7)
    })
})