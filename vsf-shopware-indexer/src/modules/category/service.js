const transform = require('./transformer')
const apiConnector = require('../common/apiConnector')
const { insertCategories } = require('../common/elasticConnector')
const logger = require('../common/logger')

const getCategory = categoryId => {}
const getAllCategories = async () => {
  try {
    const response = await apiConnector.get('category?limit=50')
    return response.data.data
  } catch (e) {
    console.log(e)
  }
  
}
const saveCategory = category => transform(category)
const reindex = async (page, size) => {
  logger.info(`categories are being rebuilt... (page: ${page}; size: ${size})`)
  const categories = await getAllCategories()
  if (typeof categories == 'undefined') {
    console.log('there is no category to import')
    return;
  }
  const result = Promise.all(await categories.map(async category => await transform(category)))
  result.then(children => insertCategories(children))
}

module.exports = {
  reindex
}