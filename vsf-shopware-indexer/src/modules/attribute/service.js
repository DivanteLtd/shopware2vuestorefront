const transform = require('./transformer')
const { getAdmin } = require('../common/apiConnectorAdmin')
const logger = require('../common/logger')
const { insertAttributes } = require('../common/elasticConnector')

const getAttribute = attributeId => {}
const getAllAttributes = async () => {
  try {
    const response = await getAdmin('property-group?include=options')
    return response.data.data
  } catch (e) {
    console.log(e)
  }
  
}
const saveAttribute = attribute => transform(attribute)
const reindex = async (page, size) => {
  //logger.info(host, protocol, prefix, token)
  logger.info(`attributes are being rebuilt... (page: ${page}; size: ${size})`)
  const attributes = await getAllAttributes()
  const result = Promise.all(await attributes.map(async attribute => await transform(attribute)))
  result.then(attribues => insertAttributes(attribues))
}

module.exports = {
  reindex
}