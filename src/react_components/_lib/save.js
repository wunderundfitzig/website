/* global FormData, fetch, Blob, btoa, atob */

'use strict'
import uuid from 'uuid/v4'

function dataURLtoBlob (dataurl) {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

export default function ({ state, password }) {
  const stateCopy = JSON.parse(JSON.stringify(state))
  const images = {}

  const findImg = (obj) => {
    for (const key in obj) {
      const value = obj[key]

      if (typeof value === 'object') {
        findImg(value)
        continue
      }
      if (value.startsWith('data:')) {
        const filename = uuid()
        images[filename] = dataURLtoBlob(value)
        obj[key] = '/assets/imgs/' + filename
      }
    }
  }
  findImg(stateCopy)

  const data = new FormData()
  for (const filename in images) {
    const image = images[filename]
    data.append(filename, image, filename)
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
