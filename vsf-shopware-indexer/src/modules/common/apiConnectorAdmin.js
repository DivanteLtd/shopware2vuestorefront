const request = require('axios')
const { protocol, host, version, prefix, token, user, password } = require('../../../config').api

let cachedToken = false
const getToken = async (refresh = false) => {
  if (cachedToken && !refresh) {
    return cachedToken
  }
  
  let authObject = {}

  //only write scope will be sufficent
  authObject.scopes = "write"

  //use client_credentials grant when explizit set inside the api credentials else password is used
  if(grant_type && grant_type == "client_credentials") {
    authObject.grant_type = grant_type 
    authObject.client_id = client_id
    authObject.client_secret = client_secret
  }else {
    authObject.client_id = "administration"
    authObject.grant_type = "password"
    authObject.username = user
    authObject.password = password
  }
  

  const response = await request.post(`${protocol}://${host}/api/oauth/token`, authObject)

  cachedToken = response.data.access_token
  return response.data.access_token
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
const postAdmin = async (endpoint, data) => request.post(getUrl(endpoint), data, await getAuthHeaders())
const patchAdmin = async (endpoint, data, refreshToken = false) => request.patch(getUrl(endpoint), data, await getAuthHeaders(refreshToken))
const deleteAdmin = async (endpoint, refreshToken = false) => request.delete(getUrl(endpoint), await getAuthHeaders(refreshToken))


module.exports = {
  getAdmin,
  postAdmin,
  deleteAdmin,
  patchAdmin
}
