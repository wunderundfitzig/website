'use strict'

import HTTPStatus from 'http-status'
import fs from 'fs'
import path from 'path'
import cache from './_cache'

const DATA_PATH = path.join(__dirname, '../../data')

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
  const { creatives, stories } = req.body
  const writeActions = []

  if (creatives && creatives.length !== 0) {
    writeActions.push(writeJsonFile({
      filename: path.join(DATA_PATH, 'creatives.json'),
      json: creatives
    }))
  }
  if (stories && stories.length !== 0) {
    writeActions.push(writeJsonFile({
      filename: path.join(DATA_PATH, 'stories.json'),
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
