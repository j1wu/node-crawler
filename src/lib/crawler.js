'use strict'

const request = require('request')
const C = require('../misc/constants')

module.exports = descriptor => {
  return new Promise((resolve, reject) => {
    const url = getUrl(descriptor)
    const crawl = getCrawler(descriptor)

    crawl(url, (error, response, body) => {
      if (error) { reject(error) }
      if (response.statusCode >= 200 && response.statusCode < 300) {
        resolve(Object.assign(descriptor, { html: body }))
      }
      let err = new Error(response.statusCode)
      err.response = response
      reject(err)
    })
  })
}

function getUrl(descriptor) {
  let { url } = descriptor
  if (!url || typeof url !== 'string') {
    throw new TypeError('Expect an url of type string')
  }
  if (url.indexOf('http') < 0) {
    throw new TypeError('Expect an url with protocol identifier (http or https)')
  }
  return url
}

function getCrawler(descriptor) {
  const { options = {} } = descriptor
  const defaultOptions = {
    headers: { 'User-Agent': getRandomUserAgent() },
    timeout: 1000 * 60,
    gzip: true
  }
  return request.defaults(Object.assign(defaultOptions, options))
}

function getRandomUserAgent() {
  return C.UA[Math.floor(Math.random() * (C.UA.length - 1))]
}
