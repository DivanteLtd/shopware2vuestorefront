const transform = require('./transformer')
const apiConnector = require('../common/apiConnector')
const { insertProducts } = require('../common/elasticConnector')
const logger = require('../common/logger')

const getAllProducts = async (page, size) => {
  try {
    // it gets only the parent products. If configurable options exist - extract them as a child items.
    // TODO: manage case with simple products only
    const response = await apiConnector.post('product', {
      "filter": 
      {
        "product.parentId": null
      },
      "limit": size,
      "page": page
      
    })
    return response.data.data
  } catch (e) {
    console.log(e)
  }
  
}

const reindex = async (page, size) => {
  logger.info(`products are being rebuilt...`)
  
  try {
    const products = await getAllProducts(page, size)
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