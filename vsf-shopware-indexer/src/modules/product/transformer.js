const { get } = require('../common/apiConnector')
const { getAdmin } = require('../common/apiConnectorAdmin')
const cache = {
  'media': {}
}

const extractMedia = async productId => {
  try {
    const result = await get(`product/${productId}`)
    //console.log(result.data.data.media)
    let mediaArray = result && result.data.data.media && result.data.data.media.map(({position, media: {url}}) => ({
      image: url,
      pos: position,
      typ: 'image',
      lab: ""
    }))

    if (false || !mediaArray || mediaArray.length == 0) {
      console.log('tuuuuuuu')
      const apiresponse = await getAdmin(`product/${productId}/media`)
      console.log('tu 2')
    //console.log(apiresponse.data.data)
    console.log('------------------========================')
      mediaArray = apiresponse.data.data && apiresponse.data.data.map(async ({position, media}) => ({
        image: media.url,
        pos: position,
        typ: 'image',
        lab: ""
      }))
    }

    return Array.isArray(mediaArray) ? Promise.all(mediaArray) : []
  } catch (e) {
    console.log(e)
  }

  return []
  
}

const extractCategoryName = async categoryId => {
  const result = await get(`category/${categoryId}`)
  return result.data.data.name
}

const extractIntId = async categoryId => {
  const result = await get(`category/${categoryId}`)
  return result.data.data.autoIncrement
}
const extractCategories = async productId => {
  const result = await get(`product/${productId}`)
  const categories = result.data.data.categoryTree ? result.data.data.categoryTree.map(async category => ({"category_id": await extractIntId(category),
  "name": await extractCategoryName(category) })) : []
  return Promise.all(categories)
}
const appendAttributes = async (product, propertyIds) => {

  if (propertyIds.id == "58fd532dee7a4e11a04c7fa4acfa3a76") {
    const propertyId = propertyIds.propertyIds[0]
    const productProperty = await getAdmin(`product-property-option/${propertyId}`)
    console.log(propertyIds.propertyIds)
  }

  return product
}
const template = require('./template')
const transformedProduct = async (product) => appendAttributes(template(product, await extractCategories(product.id), await extractMedia(product.id)), product)

module.exports = transformedProduct