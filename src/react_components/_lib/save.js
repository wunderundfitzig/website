/* global FormData, fetch, Blob, btoa, atob */

'use strict'
import uuid from 'uuid/v4'
import mime from 'mime-types'

function dataURLtoBlob (dataurl) {
  const arr = dataurl.split(',')
  const mimeType = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return {
    blob: new Blob([u8arr], { type: mimeType }),
    extension: mime.extension(mimeType)
  }
}

export default function ({ state, password }) {
  const stateCopy = JSON.parse(JSON.stringify(state))
  const images = {}

  const findImg = (obj) => {
    for (const key in obj) {
      const value = obj[key]

      if (typeof value !== 'object') continue

      if (value.imageNeedsUpload) {
        const image = value
        const { blob, extension } = dataURLtoBlob(image.url)
        const filename = `${uuid()}.${extension}`
        images[filename] = blob

        image.url = '/assets/imgs/' + filename
        image.imageNeedsUpload = false
        // TODO: add support for HighResImg upload
        // based on @2x file extension
        image.hasHighresVersion = false

        obj[key] = image
      } else {
        findImg(value)
      }
    }
  }
  findImg(stateCopy)

  const data = new FormData()
  for (const filename in images) {
    const image = images[filename]
    data.append('image', image, filename)
  }
  data.append('stories', JSON.stringify(stateCopy.stories))
  data.append('creatives', JSON.stringify(stateCopy.creatives))

  return fetch(`${window.location.origin}/api/saveEdits`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`wundf:${password}`)}`
    },
    body: data
  })
}
