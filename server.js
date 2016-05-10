'use strict'

import express from 'express'
import path from 'path'
import favicon from 'serve-favicon'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import routes from './routes'

var app = express()
app.use(favicon(path.join(__dirname, 'assets/favicon.ico')))
app.use('/assets', express.static('assets'))
app.use('/wunderundfitzig.jpg', express.static('assets/wunderundfitzig.jpg'))
app.use((req, res, next) => {
  // Note that req.url here should be the full URL path from
  // the original request, including the query string.
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      // You can also check renderProps.components or renderProps.routes for
      // your "not found" component or route respectively, and send a 404 as
      // below, if you're using a catch-all route.
      res.status(200).send(renderToString(<RouterContext {...renderProps} />))
    } else {
      res.status(404).send('Not found')
    }
  })
})

app.listen(process.env.PORT || 8080)
