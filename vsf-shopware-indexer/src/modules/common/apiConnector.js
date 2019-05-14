const request = require('axios')
const { protocol, host, version, prefix, token } = require('../../../config').api

const getAuthHeaders = () => ({'headers': {'sw-access-key': token}})
const getRequestUri = () => `${protocol}://${host}/${prefix}/${version}`
const getUrl = (endpoint) => `${getRequestUri()}/${endpoint}`

const get = endpoint => {
  return request.get(getUrl(endpoint), getAuthHeaders())
}
const post = (endpoint, data) => request.post(getUrl(endpoint), data, getAuthHeaders())

module.exports = {
  get,
  post,
}