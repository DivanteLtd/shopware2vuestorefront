const request = require('axios')
const { protocol, host, version, prefix, token, user, password } = require('../../../config').api
let cachedToken = false

const getToken = async (refresh = false) => {
  if (cachedToken && !refresh) {
    return cachedToken
  }

  const response = await request.post(`${protocol}://${host}/api/oauth/token`, {
    client_id: "administration",
    grant_type: "password",
    scopes: "write",
    username: user,
    password: password
  })
  cachedToken = response.data.access_token
  return cachedToken
}

const getAuthHeaders = async (refreshToken = false) => {
  const token = await getToken(refreshToken)
  return ({'headers': {'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'}})
}

const getRequestUri = () => `${protocol}://${host}/api/${version}`
const getUrl = (endpoint) => `${getRequestUri()}/${endpoint}`

const getAdmin = async (endpoint, refreshToken = false) => {
  return request.get(getUrl(endpoint), await getAuthHeaders(refreshToken))
}
const postAdmin = async (endpoint, data, refreshToken = false) => request.post(getUrl(endpoint), data, await getAuthHeaders(refreshToken))
const patchAdmin = async (endpoint, data, refreshToken = false) => request.patch(getUrl(endpoint), data, await getAuthHeaders(refreshToken))
const deleteAdmin = async (endpoint, refreshToken = false) => request.delete(getUrl(endpoint), await getAuthHeaders(refreshToken))


module.exports = {
  getAdmin,
  postAdmin,
  deleteAdmin,
  patchAdmin
}