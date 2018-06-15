'use strict'

import fetch from 'node-fetch'
import request from 'request'
import fs from 'fs'
import path from 'path'
import cache from './_cache'

export default (req, res) => {
  const fields = 'message,object_id,created_time,picture,link,type'
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN

  fetch('https://graph.facebook.com/wunderundfitzig/feed?' +
        `fields=${fields}&access_token=${accessToken}&limit=10`)
  .then(res => {
    console.log(res)
    return res
  })
  .then(fbRes => fbRes.json())
  .then(feed => feed.data.filter(post =>
      (post.type === 'photo' || post.type === 'link') && post.object_id))
  .then(feed => Promise.all(feed.map(post => (
    fetch(`https://graph.facebook.com/${post.object_id}?` +
          `fields=images&access_token=${accessToken}`)
    .then(res => res.json())
    .then(res => {
      const image = res.images[0] // images[0] should be the largest one
      const basename = path.basename(image.source)
      const imgName = basename.split('?')[0]
      const filename = path.join(process.env.IMAGE_PATH, 'newsFeed', imgName)

      download(image.source, filename)
      post.picture = {
        ...image,
        source: `/assets/imgs/newsFeed/${imgName}`
      }
      return post
    })
  ))))
  .then(feed => {
    if (!res.headersSent) res.send(feed)
    cache.store({ key: req.path, json: feed })
  })
}

// from https://stackoverflow.com/questions/12740659/downloading-images-with-node-js#12751657

var download = function(uri, filename){
  request.head(uri, function(err, res, body) {
    if (err) return
    request(uri).pipe(fs.createWriteStream(filename))
  })
}
