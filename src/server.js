'use strict'

import express from 'express'
import path from 'path'
import favicon from 'serve-favicon'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import routes from './routes'
import preFetchData from './preFetchData'
import store from './store'

var app = express()
app.use(favicon(path.join(__dirname, 'assets/favicon.ico')))
app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use('/wunderundfitzig.jpg', express.static(path.join(__dirname, 'assets/wunderundfitzig.jpg')))
app.use((req, res, next) => {
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      preFetchData(renderProps.components, store).then(preFetchedData => {
        store.news = preFetchedData.news
        res.status(200).send(renderToString(<RouterContext {...renderProps} />))
      })
    } else {
      res.status(404).send('Not Found')
    }
  })
})

app.listen(process.env.PORT || 8080)
