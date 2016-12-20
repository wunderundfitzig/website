'use strict'

import express from 'express'
import fetch from 'node-fetch'

const api = express.Router()
const cache = {}

api.get('/newsFeed', (req, res) => {
  const fields = 'message,object_id,created_time,picture,link,type'
  const accessToken = '1406084659649648|WQ4B1azOuVfGMUoUvDrtXsJ27DE'

  if (cache.newsFeed) res.send(cache.newsFeed.feed)

  // cache for 1h
  const cachedDataIsStillValid = cache.newsFeed && Date.now() - cache.newsFeed.timestamp < 3600000
  if (cachedDataIsStillValid) return

  fetch(`https://graph.facebook.com/wunderundfitzig/feed?fields=${fields}&access_token=${accessToken}&limit=10`)
  .then(fbRes => fbRes.json())
  .then(feed => feed.data.filter(post => (post.type === 'photo' || post.type === 'link') && post.object_id))
  .then(feed => Promise.all(feed.map(post =>
    fetch(`https://graph.facebook.com/${post.object_id}?fields=images&access_token=${accessToken}`)
    .then(res => res.json())
    .then(res => {
      post.picture = res.images[0].source // images[0] should be the largest one)
      return post
    })
  )))
  .then(feed => {
    // for the first load the cache was empty
    // so send data now
    if (!cache.newsFeed) res.send(feed)
    cache.newsFeed = { feed, timestamp: Date.now() }
  })
})

api.get('*', (req, res) => { res.sendStatus(404) })

export default api
