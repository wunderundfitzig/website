'use strict'
import fetch from 'node-fetch'

/**
* fetches data for a list of components,
* needed by them before render
* @param components {array} of react components
* @param oldDataSet {object} data already loaded by previos request
* @return {Promise} of the fetched data
*/
let preFetchData = (components, oldDataSet) => {
  let responses = []
  components.forEach(component => {
    if (!component || !component.load) return

    component.load.forEach(loadData => {
      let url = loadData.url + '?'
      for (let param in loadData.params) {
        param = encodeURIComponent(param)
        let value = encodeURIComponent(loadData.params[param])
        url += `${ param }=${ value }&`
      }

      let oldData = oldDataSet[loadData.key]
      let oldDataExists = oldData !== undefined
      let oldDataIsStillValid = oldDataExists && Date.now() - oldData.timestamp < 3600000 // cache for 1h

      if (oldDataIsStillValid && !oldData.alwaysReload) {
        responses.push(oldData)
      } else {
        responses.push(
          fetch(url).then(res => res.json().then(data =>
            ({ key: loadData.key, data: data, timestamp: Date.now() })
          ))
        )
      }
    })
  })

  return Promise.all(responses).then(responses => responses.reduce((obj, response) => {
    obj[response.key] = response
    return obj
  }, {}))
}

export default preFetchData
