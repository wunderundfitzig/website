'use strict'

import express from 'express'
import HTTPStatus from 'http-status'
import bodyParser from 'body-parser'
import multer from 'multer'
import passport from 'passport'
import { BasicStrategy } from 'passport-http'

import cache from './api/_cache'
import jsonFromFile from './api/jsonFromFile'
import newsFeed from './api/newsFeed'
import saveEdits from './api/saveEdits'

passport.use(new BasicStrategy(
  function (userid, password, done) {
    if (userid === 'wundf' && password === process.env.EDIT_PASSWORD) {
      done(null, {})
    } else {
      done()
    }
  }
))

const api = express.Router()
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.IMAGE_PATH)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage })

api.get('*', (req, res, next) => {
  res.set('Content-Type', 'application/json; charset=utf-8')
  if (cache.has({ key: req.path })) res.send(cache.get({ key: req.path }))

  if (!cache.hasFreshDataFor({ key: req.path })) next()
})

api.use(bodyParser.json())
api.post('/saveEdits', passport.authenticate('basic', { session: false }),
  upload.array('image'), saveEdits)
api.get('/creatives', jsonFromFile)
api.get('/stories', jsonFromFile)
api.get('/newsFeed', newsFeed)

api.get('*', (req, res) => { res.sendStatus(HTTPStatus.NOT_FOUND) })

export default api
