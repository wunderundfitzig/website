'use strict'
import fetch from 'node-fetch'
import React from 'react'

export class InitialDataLoader {
  constructor () {
    this.storedRequestDescriptions = []
  }

  /**
  * adds a list of 'requestDescriptions' to the stored list of 'requestDescriptions'
  * a 'requestDescription' looks like this:
  * {
  *   key: 'unique key string',
  *   alwaysReload: false,
  *   url: 'url string',
  *   params: { key: val }
  * }
  * @param newRequestDescriptions {array} of 'requestDescriptions'
  */
  requestData (newRequestDescriptions) {
    this.storedRequestDescriptions = [...this.storedRequestDescriptions, ...newRequestDescriptions]
  }

  /**
  * fetches data asked for by a list of 'requestDescriptions'
  * @param cache {object} data already loaded by previos request
  * @return {Promise} of the fetched data
  */
  loadRequestedData (cache = {}) {
    const responses = []
    this.storedRequestDescriptions.forEach(requestDescription => {
      let url = requestDescription.url + '?'
      for (let param in requestDescription.params) {
        param = encodeURIComponent(param)
        const value = encodeURIComponent(requestDescription.params[param])
        url += `${param}=${value}&`
      }

      const cachedData = cache[requestDescription.key]
      const cachedDataExists = cachedData !== undefined
      const cachedDataIsStillValid = cachedDataExists && Date.now() - cachedData.timestamp < 3600000 // cache for 1h

      if (cachedDataIsStillValid && !requestDescription.alwaysReload) {
        responses.push(cachedData)
      } else {
        responses.push(
          fetch(url).then(res => res.json().then(data =>
            ({ key: requestDescription.key, data: data, timestamp: Date.now() })
          ))
        )
      }
    })

    this.storedRequestDescriptions = []

    return Promise.all(responses).then(responses => responses.reduce((obj, response) => {
      obj[response.key] = response
      return obj
    }, {}))
  }
}

export class InitialDataCollecter extends React.Component {
  getChildContext () {
    const initialDataLoader = this.props.initialDataLoader || new InitialDataLoader()
    return { initialDataLoader: initialDataLoader }
  }

  render () { return this.props.children }
}

InitialDataCollecter.propTypes = {
  initialDataLoader: React.PropTypes.instanceOf(InitialDataLoader),
  children: React.PropTypes.node
}
InitialDataCollecter.childContextTypes = {
  initialDataLoader: React.PropTypes.instanceOf(InitialDataLoader)
}
