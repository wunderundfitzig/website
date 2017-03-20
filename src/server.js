'use strict'

import express from 'express'
import HTTPStatus from 'http-status'
import path from 'path'
import favicon from 'serve-favicon'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { ServerRouter, createServerRenderContext } from 'react-router'
import api from './api'
import StoreProvider, { ServerRenderPreparer } from './stores/_storeProvider'
import storeFactory from './stores/_storeFactory'
import Page from './react_components/page'

const app = express()
const mailSignatureImgPath = path.join(__dirname, 'assets/wunderundfitzig.jpg')
app.use(favicon(path.join(__dirname, 'assets/favicon.ico')))
app.use('/api', api)
app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use('/wunderundfitzig.jpg', express.static(mailSignatureImgPath))

app.use((req, res, next) => {
  const renderContext = createServerRenderContext()
  const serverRenderPreparer = new ServerRenderPreparer()
  const store = storeFactory.createStore()

  let markup = renderToString(
    <ServerRouter location={req.url} context={renderContext}>
      <StoreProvider store={store} serverRenderPreparer={serverRenderPreparer}>
        <Page />
      </StoreProvider>
    </ServerRouter>
  )

  const result = renderContext.getResult()
  if (result.redirect) {
    return res.redirect(HTTPStatus.MOVED_PERMANENTLY, result.redirect.pathname)
  }
  if (result.missed) res.status(HTTPStatus.NOT_FOUND)

  serverRenderPreparer.awaitPromises().then(fullfilled => {
    if (result.missed || fullfilled.length > 0) {
      markup = renderToString(
        <ServerRouter location={req.url} context={renderContext}>
          <StoreProvider store={store}>
            <Page />
          </StoreProvider>
        </ServerRouter>
      )
    }
    res.send(markup)
  })
  .catch(e => {
    console.log(e)
    res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR)
  })
})

app.listen(process.env.PORT)
console.log('listening on port: ', process.env.PORT)
