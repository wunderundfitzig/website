'use strict'

import HTTPStatus from 'http-status'
import fs from 'fs'
import path from 'path'
import cache from './_cache'

export default (req, res) => {
  const { creatives } = req.body

  if (creatives && creatives.length !== 0) {
    fs.writeFile(
      path.join(__dirname, '../../data/creatives.json'),
      JSON.stringify(creatives),
      'utf8',
      err => {
        if (err) {
          console.log(err)
          res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR)
        } else {
          res.sendStatus(HTTPStatus.OK)
          cache.invalidate('/creatives')
        }
      }
    )
  }
}
