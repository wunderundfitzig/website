'use strict'

import HTTPStatus from 'http-status'
import fs from 'fs'
import path from 'path'
import cache from './_cache'

export default (req, res) => {
  const filename = req.path.replace('/', '')
  const filepath = path.join(process.env.DATA_PATH, `${filename}.json`)
  fs.readFile(filepath, 'utf8', (err, content) => {
    if (err) {
      if (!res.headersSent) res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send(err)
    } else {
      cache.store({ route: req.path, json: content })
      if (!res.headersSent) res.send(content)
    }
  })
}
