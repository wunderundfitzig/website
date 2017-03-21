'use strict'

import HTTPStatus from 'http-status'
import fs from 'fs'
import path from 'path'
import cache from './_cache'

/**
 * encodes object as json string and writes it to file
 * @param  {string} filename
 * @param  {object} json
 * @return {Promise} empty promise
 */
const writeJsonFile = ({ filename, json }) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, JSON.stringify(json), 'utf8', err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

export default (req, res) => {
  let { creatives, stories } = req.body
  creatives = JSON.parse(creatives)
  stories = JSON.parse(stories)
  const writeActions = []

  // TODO: detect highres images and create small version of them
  // with: https://github.com/EyalAr/lwip

  if (creatives && creatives.length !== 0) {
    writeActions.push(writeJsonFile({
      filename: path.join(process.env.DATA_PATH, 'creatives.json'),
      json: creatives
    }))
  }
  if (stories && stories.length !== 0) {
    writeActions.push(writeJsonFile({
      filename: path.join(process.env.DATA_PATH, 'stories.json'),
      json: stories
    }))
  }

  Promise.all(writeActions)
  .then(() => {
    cache.invalidate('/creatives')
    res.sendStatus(HTTPStatus.OK)
  })
  .catch(err => {
    console.log('save err', err)
    res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR)
  })
}
