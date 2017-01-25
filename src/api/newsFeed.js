'use strict'

import fetch from 'node-fetch'
import cache from './_cache'

export default (req, res) => {
  const fields = 'message,object_id,created_time,picture,link,type'
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN

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
    cache.store({ key: req.path, json: feed })
  })
}
