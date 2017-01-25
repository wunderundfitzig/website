'use strict'

import express from 'express'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

const api = express.Router()
const cache = {}

const storeInCache = ({ route, json }) => {
  cache[route] = { json, timestamp: Date.now() }
}

api.get('*', (req, res, next) => {
  res.set('Content-Type', 'application/json; charset=utf-8')
  if (cache[req.path]) res.send(cache[req.path].json)

  const validDataInCache = cache[req.path] && Date.now() - cache[req.path].timestamp < 3600000
  if (!validDataInCache) next()
})

api.get('/creatives', (req, res) => {
  const filepath = path.join(__dirname, '../data/creatives.json')
  fs.readFile(filepath, 'utf8', (err, content) => {
    if (err) {
      if (!res.headersSent) res.status(500).send(err)
    } else {
      storeInCache({ route: req.path, json: content })
      if (!res.headersSent) res.send(content)
    }
  })
})

api.get('/stories', (req, res) => {
  const filepath = path.join(__dirname, '../data/stories.json')
  fs.readFile(filepath, 'utf8', (err, content) => {
    if (err) {
      if (!res.headersSent) res.status(500).send(err)
    } else {
      storeInCache({ route: req.path, json: content })
      if (!res.headersSent) res.send(content)
    }
  })
})

api.get('/newsFeed', (req, res) => {
  const fields = 'message,object_id,created_time,picture,link,type'
  const accessToken = '1406084659649648|WQ4B1azOuVfGMUoUvDrtXsJ27DE'

  fetch(`https://graph.facebook.com/wunderundfitzig/feed?fields=${fields}&access_token=${accessToken}&limit=10`)
  .then(fbRes => fbRes.json())
  .then(feed => feed.data.filter(post => (post.type === 'photo' || post.type === 'link') && post.object_id))
  .then(feed => Promise.all(feed.map(post => (
    fetch(`https://graph.facebook.com/${post.object_id}?fields=images&access_token=${accessToken}`)
    .then(res => res.json())
    .then(res => {
      post.picture = res.images[0] // images[0] should be the largest one)
      return post
    })
  ))))
  .then(feed => {
    if (!res.headersSent) res.send(feed)
    storeInCache({ route: req.path, json: feed })
  })
})

api.get('*', (req, res) => { res.sendStatus(404) })

export default api
