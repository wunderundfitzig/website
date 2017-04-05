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

const getJsonFromFile = (filename) => {
  const filepath = path.join(process.env.DATA_PATH, `${filename}.json`)
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf8', (err, content) => {
      if (err) {
        reject(err)
      } else {
        resolve(JSON.parse(content))
      }
    })
  })
}

const resolvePath = ({ obj, keys }) => {
  keys = keys.split('.')
  while (keys.length > 0) {
    const key = keys.shift()
    obj = obj[key]
  }
  return obj
}

export default (req, res) => {
  Promise.all([
    getJsonFromFile('creatives'),
    getJsonFromFile('stories')
  ])
  .then(([creatives, stories]) => ({ creatives, stories }))
  .then(oldState => {
    const newState = {
      creatives: req.body.creatives ? JSON.parse(req.body.creatives) : [],
      stories: req.body.stories ? JSON.parse(req.body.stories) : []
    }

    req.files.forEach(file => {
      const keys = file.originalname
      const img = resolvePath({ obj: newState, keys })
      // TODO: detect highres images and create small version of them
      // with: https://github.com/EyalAr/lwip
      img.url = `/assets/imgs/${file.filename}`
      img.imageNeedsUpload = false

      const oldImg = resolvePath({ obj: oldState, keys })
      const oldImgPath = path.join(process.env.IMAGE_PATH,
                                   path.basename(oldImg.url))
      fs.unlink(oldImgPath, () => {})
    })

    return newState
  })
  .then(newState => {
    const writeActions = []
    if (newState.creatives.length !== 0) {
      writeActions.push(writeJsonFile({
        filename: path.join(process.env.DATA_PATH, 'creatives.json'),
        json: newState.creatives
      }))
    }
    if (newState.stories.length !== 0) {
      writeActions.push(writeJsonFile({
        filename: path.join(process.env.DATA_PATH, 'stories.json'),
        json: newState.stories
      }))
    }

    return Promise.all(writeActions)
  })
  .then(() => {
    cache.invalidate('/creatives')
    cache.invalidate('/stories')
    res.sendStatus(HTTPStatus.OK)
  })
  .catch(err => {
    console.log('save err', err)
    res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR)
  })
}
