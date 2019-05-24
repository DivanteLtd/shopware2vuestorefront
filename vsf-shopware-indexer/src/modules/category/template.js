const { get } = require('../common/apiConnector')
const { getAdmin } = require('../common/apiConnectorAdmin')

const slugger = require('../common/slugger')
const { timeout } = require('../common/helper')

const extractCategoryIntId = async categoryId => {
  if (!categoryId) {
    return 1
  }
  try {
    const result = await getAdmin(`category/${categoryId}`)
    return result.data.data.autoIncrement
  } catch (e) {
    console.log(e)
    console.log(`couldn't find the category with ${categoryId}.`)
  }
  return 1
}

const extractSubcategories = async (parentId, parentIdInt) => {

  const subcategories = []
  const subcategoriesResponse = await get(`category?filter[category.parentId]=${parentId}`)
  if (!subcategoriesResponse.data.data) {
    return []
  }

  for (const {  id, parentId, name, createdAt, updatedAt, level, position, childrenCount, autoIncrement } of subcategoriesResponse.data.data) {
    const subcat = {
      "entity_type_id": 3,
      "attribute_set_id": 0,
      "parent_id": parentIdInt ? parentIdInt : 0,
      "created_at": "2013-01-14 10:12:53",
      "updated_at": "2013-01-14 10:12:53",
      "position": 1,
      "level": level+1,
      "children_count": childrenCount ? childrenCount : 1,
      "available_sort_by": null,
      "include_in_menu": 1,
      "product_count": 10,
      "name": name,
      "id": autoIncrement,
      "children_data": parentId !== id && await extractSubcategories(id, parentIdInt),
      "children_count": subcategories.length,
      "is_anchor": true,
      "url_key": `${slugger(name)}-${autoIncrement}`,
      "slug": `${slugger(name)}-${autoIncrement}`,
      "url_path":  !parentId ? `1/${autoIncrement}` : `1/${parentIdInt}/${autoIncrement}`,
      "is_active": true,
    }
    subcat.children_count = subcat.children_data.length
    subcategories.push(subcat)
  }

  return subcategories
}

const transform = async ({ id, parentId, name, createdAt, updatedAt, level, position, childrenCount, autoIncrement }) => {
  const result = {
    "entity_type_id": 3,
    "attribute_set_id": 0,
    "parent_id": await extractCategoryIntId(parentId),
    "created_at": "2013-01-14 10:12:53",
    "updated_at": "2013-01-14 10:12:53",
    "position": 1,
    "level": level+1,
    "children_count": childrenCount ? childrenCount : 1,
    "available_sort_by": null,
    "include_in_menu": 1,
    "product_count": 10,
    "name": name,
    "id": autoIncrement,
    "children_data": await extractSubcategories(id, autoIncrement),
    "children_count": 0,
    "is_anchor": true,
    "url_key": `${slugger(name)}-${autoIncrement}`,
    "slug": `${slugger(name)}-${autoIncrement}`,
    "url_path": `1/${autoIncrement}`,
    "is_active": true,
  }

  result.children_count = result.children_data.length

  return result
} 

module.exports = transform