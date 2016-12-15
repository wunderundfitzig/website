'use strict'

import express from 'express'
import path from 'path'
import favicon from 'serve-favicon'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { ServerRouter, createServerRenderContext } from 'react-router'
import { InitialDataCollecter, InitialDataLoader } from './initialDataLoader'
import Page from './react_components/page'

const app = express()
app.use(favicon(path.join(__dirname, 'assets/favicon.ico')))
app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use('/wunderundfitzig.jpg', express.static(path.join(__dirname, 'assets/wunderundfitzig.jpg')))

app.use((req, res, next) => {
  const renderContext = createServerRenderContext()
  const initialDataLoader = new InitialDataLoader()

  let markup = renderToString(
    <ServerRouter location={ req.url } context={ renderContext }>
      <InitialDataCollecter initialDataLoader={ initialDataLoader }>
        <Page initialData={ {} } location={ req.url } />
      </InitialDataCollecter>
    </ServerRouter>
  )

  const result = renderContext.getResult()
  if (result.redirect) return res.redirect(301, result.redirect.pathname)
  if (result.missed) res.status(404)

  initialDataLoader.getData()
  .then(initialData => {
    markup = renderToString(
      <ServerRouter location={ req.url } context={ renderContext }>
        <Page initialData={ initialData } location={ req.url } />
      </ServerRouter>
    )
    res.send(markup)
  })
  .catch(e => {
    console.log(e)
    res.sendStatus(500)
  })
})

app.listen(process.env.PORT || 8080)
