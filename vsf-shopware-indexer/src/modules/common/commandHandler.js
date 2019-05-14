const TYPE_ATTRIBUTE = 'attribute'
const TYPE_CATEGORY = 'category'
const TYPE_PRODUCT = 'product'
const TYPE_TAXRULE = 'taxrule'
const TYPE_ALL = 'all'
const allowedTypes = [TYPE_ATTRIBUTE, TYPE_CATEGORY, TYPE_PRODUCT, TYPE_TAXRULE, TYPE_ALL]

module.exports = async (indexName, {p, s}) => {
  const page = p || 1
  const size = s || 100

  
  if (!allowedTypes.includes(indexName)) {
    console.log(`Incorrect provided index type: ${indexName}. Allowed types: ${allowedTypes})`)
  }

  const service = indexName === TYPE_ALL ? require('../common/allIndexesService') : require(`../${indexName}/service`)
  service.reindex(page, size)
}