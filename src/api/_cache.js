'use strict'

const cache = {}

export default {
  has ({ key }) { return !!cache[key] },
  get ({ key }) { return cache[key].json },
  hasFreshDataFor ({ key }) {
    return !!cache[key] && Date.now() - cache[key].timestamp < 3600000
  },
  store ({ key, json }) {
    cache[key] = { json, timestamp: Date.now() }
  },
  invalidate ({ key }) {
    cache[key] = undefined
  }
}
