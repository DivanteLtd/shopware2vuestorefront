
const dateFromObjectId = function (objectId) {
  const date = new Date(parseInt(objectId.substring(0, 8), 16) * 1000)
  const day = date.getDay()
  const hour = date.getHours()
  const minutes = date.getMinutes()
  const miliseconds = date.getMilliseconds()

	return hour+minutes+miliseconds+day
};


const transform = async (attribute, options) => {
  return {
    "is_wysiwyg_enabled": false,
    "is_html_allowed_on_front": true,
    "used_for_sort_by": false,
    "is_filterable": true,
    "is_filterable_in_search": false,
    "is_used_in_grid": true,
    "is_visible_in_grid": false,
    "is_filterable_in_grid": true,
    "position": 0,
    "apply_to": [
        "simple",
        "virtual",
        "configurable"
    ],
    "is_searchable": "0",
    "is_visible_in_advanced_search": "0",
    "is_comparable": "0",
    "is_used_for_promo_rules": "1",
    "is_visible_on_front": "0",
    "used_in_product_listing": "1",
    "is_visible": true,
    "scope": "global",
    "attribute_id": dateFromObjectId(attribute.id),
    "attribute_code": attribute.name,
    "frontend_input": "select",
    "entity_type_id": "4",
    "is_required": false,
    "options": options ?  options.map(option => ({value: dateFromObjectId(option.value), label: option.label})) : [],
    "is_user_defined": true,
    "default_frontend_label": attribute.name.toUpperCase(),
    "frontend_labels": null,
    "backend_type": "int",
    "source_model": "Magento\\Eav\\Model\\Entity\\Attribute\\Source\\Table",
    "default_value": "49",
    "is_unique": "0",
    "validation_rules": [],
    "id": dateFromObjectId(attribute.id),
  }
  
} 

module.exports = transform