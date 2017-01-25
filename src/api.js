'use strict'

import express from 'express'
import HTTPStatus from 'http-status'
import bodyParser from 'body-parser'

import cache from './api/_cache'
import jsonFromFile from './api/jsonFromFile'
import newsFeed from './api/newsFeed'
import saveEdits from './api/saveEdits'

const api = express.Router()

api.get('*', (req, res, next) => {
  res.set('Content-Type', 'application/json; charset=utf-8')
  if (cache.has({ key: req.path })) res.send(cache.get({ key: req.path }))

  if (!cache.hasFreshDataFor({ key: req.path })) next()
})

api.use(bodyParser.json())
api.post('/saveEdits', saveEdits)
api.get('/creatives', jsonFromFile)
api.get('/stories', jsonFromFile)
api.get('/newsFeed', newsFeed)

api.get('*', (req, res) => { res.sendStatus(HTTPStatus.NOT_FOUND) })

export default api
