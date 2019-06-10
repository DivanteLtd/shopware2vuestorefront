const { get, post } = require('../common/apiConnector')
const { getAdmin, deleteAdmin, patchAdmin, postAdmin } = require('../common/apiConnectorAdmin')
const { insertProducts } = require('../common/elasticConnector')
const { dateFromObjectId, timeout } = require('../common/helper')
const { attribute } = require('../../../config').map
const cache = {
  'media': {},
  'category': {},
  'attributes' : {},
  'propertyGroups': {},
}

const extractMedia = async productId => {
  try {
     const result = await getAdmin(`product/${productId}`, true)
    let mediaArray = result && result.data.data.media && result.data.data.media.map(({position, media: {url}}) => ({
      image: url,
      pos: position,
      typ: 'image',
      lab: ""
    }))

    if (!mediaArray || mediaArray.length == 0) {
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

const findGroupIdByName = async name => {
  if (cache.propertyGroups[name]) {
    return cache.propertyGroups[name]
  }
    const optionGroupDetailsResponse = await postAdmin(`search/property-group`, {
      "filter": {
        "name": name
      },
      limit: 1
    })

    if (optionGroupDetailsResponse.data.data.length) {
      cache.propertyGroups[name] = optionGroupDetailsResponse.data.data[0].id
    }
    return optionGroupDetailsResponse.data.data.length ? optionGroupDetailsResponse.data.data[0].id : null
}

const extractAttributes = async (product, propertyIds) => {
  if (!propertyIds) {
    return {}
  }
  let attributes = {}
  for (const propertyId of propertyIds) {
    if (cache.attributes[propertyId]) {
      attributes[cache.attributes[propertyId].group.name] = cache.attributes[propertyId].option.id
      continue
    }
    const optionDetailsResponse = await getAdmin(`property-group-option/${propertyId}`)
    const optionGroupId = optionDetailsResponse.data.data.groupId
    const optionGroupDetailsResponse = await getAdmin(`property-group/${optionGroupId}`)
    const optionGroupCode = optionGroupDetailsResponse.data.data.name
    attributes[optionGroupCode] = optionDetailsResponse.data.data.id
    cache.attributes[propertyId] = { option: optionDetailsResponse.data.data, group: optionGroupDetailsResponse.data.data }
  }
  return attributes
}


const getAttributesMap = async (product, propertyIds) => {
  if (!propertyIds) {
    return {}
  }
  let attributes = {}
  for (const propertyId of propertyIds) {
    if (cache.attributes[propertyId]) {
      attributes[propertyId] = cache.attributes[propertyId].option.name
      continue;
    }
    const optionDetailsResponse = await getAdmin(`property-group-option/${propertyId}`)
    attributes[propertyId] = optionDetailsResponse.data.data.name
  }
  return attributes
}

const { configurable, simple } = require('./template')

const extractVariants = async (parentId, onlyMap = false) => {
  let output = []
  const response = await post(`product`, {
    'filter': {
        'product.parentId': parentId
      }
  })

  for (const variant of response.data.data) {
    if (onlyMap) {
      const options = await getAttributesMap(variant, variant.optionIds)
      output = { ...output, ...options }
      continue;
    }
    let simpleProduct = await simple(variant)
    let attributes = await extractAttributes(variant, variant.optionIds)

    const merged = Object.assign(simpleProduct, attributes)
    output.push(merged)
  }

  return output
}

const transformedProduct = async (product) => {
  try {
    if (!product.parentId) {
      let parentProduct = await configurable(product, await extractCategories(product.categoryTree), await extractMedia(product.id))
      // extract variants as simple products
      const variants = await extractVariants(product.id)
      // insert simple products to ELASTICSEARCH
      await insertProducts(variants)
      const colorOptions = [... new Set(variants.map(variant => variant.color))]
      const sizeOptions = [... new Set(variants.map(variant => variant.size))]
      // get attributes options ids to labels map
      const attributesMap = await extractVariants(product.id, true)
      const merged = Object.assign(parentProduct, { // combine attributes into parent product
        configurable_children: variants.map(variant => {
          delete variant.type_id
          return variant
        }),
        configurable_options: [ // TODO: add dynamic mapping for previously configured product's variations. Limited to color and size so far.
          {
            "id": attribute.color,
            "attribute_id": await findGroupIdByName('color'),
            "label": "Color",
            "position": 0,
            "values": colorOptions.map(color => ({value_index: color, label: attributesMap[color]})),
            "product_id": parentProduct.id,
            "attribute_code": "color"
          },
          {
            "id": attribute.size,
            "attribute_id": await findGroupIdByName('size'),
            "label": "Size",
            "position": 0,
            "values": sizeOptions.map(size => ({value_index: size})),
            "product_id":  parentProduct.id,
            "attribute_code": "size"
          },
          
        ],
        color_options: colorOptions, // attach configured options
        size_options: sizeOptions,
      })
      return merged
    }
  
    
  } catch (e) {
    console.log(e)
  }
}

module.exports = transformedProduct