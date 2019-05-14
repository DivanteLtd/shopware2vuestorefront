const transform = require('./transformer')
const apiConnector = require('../common/apiConnector')
const { insertProducts } = require('../common/elasticConnector')
const logger = require('../common/logger')

const getProduct = productId => {}
const getAllProducts = async () => {
  try {
    const response = await apiConnector.get('product?filter[product.active]=1&limit=25')
    return response.data.data
  } catch (e) {
    console.log(e)
  }
  
}
const saveProduct = product => transform(product)
const reindex = async (page, size) => {
  logger.info(`products are being rebuilt... (page: ${page}; size: ${size})`)
  const products = await getAllProducts()
  const result = Promise.all(products.map(async product => await transform(product)))
  result.then(products => insertProducts(products))
}

module.exports = {
  reindex,
}