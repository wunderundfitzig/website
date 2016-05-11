'use strict'
import fetch from 'node-fetch'

/**
* fetches data for a list of components,
* needed by them before render
* @param components {array} of react components
* @return {Promise} of the fetched data
*/
let preFetchData = (components) => {
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

      responses.push(
        fetch(url).then(res => res.json().then(data => ({ key: loadData.key, data: data })))
      )
    })
  })

  return Promise.all(responses).then(responses => responses.reduce((obj, response) => {
    obj[response.key] = response.data
    return obj
  }, {}))
}

export default preFetchData
