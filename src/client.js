'use strict'

import React from 'react'
import { render } from 'react-dom'
import { match, browserHistory, Router } from 'react-router'
import routes from './routes'
import store from './store'

window.addEventListener('load', () => {
  store.news = window.news

  match({ routes, history: browserHistory }, (error, redirectLocation, renderProps) => {
    if (error) console.error(error)
    render(<Router {...renderProps} />, document)
  })
})
