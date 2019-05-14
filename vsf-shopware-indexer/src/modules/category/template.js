const { get } = require('../common/apiConnector')

const extractIntId = async categoryId => {
  try {
    const result = await get(`category/${categoryId}`)
    return result.data.data.autoIncrement
  } catch (e) {
    console.log(e)
  }
  
}

const transform = async ({ id, parentId, name, createdAt, updatedAt, level, position, childrenCount, autoIncrement }, subcategories) => {
  const parentIdInt = parentId && await extractIntId(parentId)

  return {
    "entity_type_id": 3,
    "attribute_set_id": 0,
    "parent_id": parentIdInt ? parentIdInt : 0,
    "created_at": "2013-01-14 10:12:53",
    "updated_at": "2013-01-14 10:12:53",
    "position": position,
    "level": level+1,
    "children_count": childrenCount ? childrenCount : 1,
    "available_sort_by": null,
    "include_in_menu": 1,
    "product_count": 10,
    "name": name,
    "id": autoIncrement,
    "children_data": parentId !== id && subcategories,
    "children_count": subcategories.length,
    "is_anchor": true,
    "path": !parentId ? `1/${autoIncrement}` : `1/${parentIdInt}/${autoIncrement}`,
    "url_key": `${id}`,
    "slug": `${id}`,
    "url_path":  !parentId ? `1/${autoIncrement}` : `1/${parentIdInt}/${autoIncrement}`,
    "is_active": true,
  }
} 

module.exports = transform