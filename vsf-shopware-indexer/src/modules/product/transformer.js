const { get } = require('../common/apiConnector')
const { getAdmin, deleteAdmin, patchAdmin } = require('../common/apiConnectorAdmin')
const { dateFromObjectId, timeout } = require('../common/helper')
const cache = {
  'media': {},
  'category': {
  }
}

const extractMedia = async productId => {
  try {
    await timeout(200)
     const result = await getAdmin(`product/${productId}`, true)
    let mediaArray = result && result.data.data.media && result.data.data.media.map(({position, media: {url}}) => ({
      image: url,
      pos: position,
      typ: 'image',
      lab: ""
    }))

    if (!mediaArray || mediaArray.length == 0) {
      await timeout(100)
    const apiresponse = await getAdmin(`product/${productId}/media`)

     mediaArray = apiresponse.data.data && apiresponse.data.data.map(({position, media}) => ({
        image: media.url,
        pos: position,
        typ: 'image',
        lab: ""
      }))
    }

    const media = Array.isArray(mediaArray) ? mediaArray : []
    return media
  } catch (e) {
    
    console.log(`get media exception`)
    console.log(e)

  return []
  }
}

const extractCategoryName = async categoryId => {
  try {
    console.log('extracting category name')
    const result = await get(`category/${categoryId}`)
    console.log(`category/${categoryId}`)
    return result.data.data.name
  } catch (e) {
    console.log(`category name.`)
  }
  
}

const extractIntId = async categoryId => {
  try {
    console.log('getting category id')
    const result = await get(`category/${categoryId}`)
    return result.data.data.autoIncrement
  } catch (e) {
    console.log(e)
  }

  return 0
  
}
const extractCategories = async categoryTree => {
  try {
    const categories = categoryTree ? categoryTree
      .map(async categoryId => {
        await timeout(100)
        if (cache['category'][categoryId]) {
          console.log(`using cached category ${categoryId}`)
          return cache['category'][categoryId]
        }
        const responseData = await patchAdmin(`category/${categoryId}?_response=true`, {})
        const { autoIncrement, name } = responseData.data.data
        cache['category'][categoryId] = {
          "category_id": autoIncrement,
          "name": name 
        }
        return {
          "category_id": autoIncrement,
          "name": name 
        }
    }) 
    : []
      
    return Promise.all(categories)
  } catch (e) {
    console.log('error extract categories')
  }

  return []
  
}
const extractAttributes = async (product, propertyIds) => {
  let attributes = {}
  for (const propertyId of propertyIds) {
    const optionDetailsResponse = await getAdmin(`property-group-option/${propertyId}`)
    const optionGroupId = optionDetailsResponse.data.data.groupId
    const optionGroupDetailsResponse = await getAdmin(`property-group/${optionGroupId}`)
    const optionGroupCode = optionGroupDetailsResponse.data.data.name
    attributes[optionGroupCode] = dateFromObjectId(propertyId)
  }
  return attributes
}
const template = require('./template')
const transformedProduct = async (product) => {
  await timeout(100)
  try {
    let attributes = extractAttributes(product, product.propertyIds)
    let newProduct = await template(product, await extractCategories(product.categoryTree), await extractMedia(product.id))
    return newProduct
    const [obj1, obj2] = await Promise.all([attributes, newProduct])
    return  Object.assign(obj1, obj2)
  } catch (e) {
    console.log(e)
  }
}

module.exports = transformedProduct