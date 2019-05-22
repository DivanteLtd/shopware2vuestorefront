const transform = require('./transformer')
const apiConnector = require('../common/apiConnector')
const { insertProducts } = require('../common/elasticConnector')
const logger = require('../common/logger')

const getAllProducts = async () => {
  try {
    const response = await apiConnector.get('product?filter[product.active]=1')
    return response.data.data
  } catch (e) {
    console.log(e)
  }
  
}

const reindex = async (page, size) => {
  logger.info(`products are being rebuilt...`)
  
  try {
    const products = await getAllProducts()
    if (!products) {
      console.log('nothing to do.')
    }
    const result = Promise.all(products.map(async product => await transform(product)))
    result.then(products => insertProducts(products))
  } catch (e) {
    console.log(e)
  }
  
}

module.exports = {
  reindex,
}