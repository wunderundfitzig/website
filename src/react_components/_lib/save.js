/* global FormData, fetch, Blob, btoa, atob */

'use strict'

function dataURLtoBlob (dataurl) {
  const arr = dataurl.split(',')
  const mimeType = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new Blob([u8arr], { type: mimeType })
}

function findImg ({ in: obj, images = {}, keys = [] }) {
  for (const key in obj) {
    const value = obj[key]

    if (typeof value !== 'object') continue

    if (value.imageNeedsUpload) {
      keys = [...keys, key].join('.')
      const image = value
      const blob = dataURLtoBlob(image.url)
      images[keys] = blob

      image.url = ''
      // TODO: add support for HighResImg upload
      // based on @2x file extension
      image.hasHighresVersion = false

      obj[key] = image
    } else {
      findImg({ in: value, images, keys: [...keys, key] })
    }
  }
  return images
}

export default function ({ state, password }) {
  const stateCopy = JSON.parse(JSON.stringify(state))
  const images = findImg({ in: stateCopy })

  const data = new FormData()
  for (const i in images) {
    const image = images[i]
    data.append('image', image, i)
  }
  data.append('stories', JSON.stringify(stateCopy.stories))
  data.append('creatives', JSON.stringify(stateCopy.creatives))
  data.append('privacyInfo', JSON.stringify(stateCopy.privacyInfo))

  return fetch(`${window.location.origin}/api/saveEdits`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`wundf:${password}`)}`
    },
    body: data
  })
}
