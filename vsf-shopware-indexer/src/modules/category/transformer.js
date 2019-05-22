const { get } = require('../common/apiConnector')
const transform = require('./template')

const extractSubcategory = async categoryId => {
  try {
    const response = await get(`category?filter[category.parentId]=${categoryId}`)
    const categories = response.data.data
    const transformedCategories = Promise.all(categories.map(async (category) => transform(category, await extractSubcategory(category.id))))
    return transformedCategories
  } catch (e) {
    console.log(e)
  }
}

const transformedCategory = async (category) => transform(category, await extractSubcategory(category.id))

module.exports = transformedCategory