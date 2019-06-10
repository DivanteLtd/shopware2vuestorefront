# Indexer

## VSF-API customization
It's important to have ES mapping (on VSF-API side) updated to handle products' attributes properly.

_vue-storefront-api/config/elastic.schema.product.json_:
```
...
"configurable_options": {
           "properties": {
               "attribute_id": {"type": "keyword"}
...
```
attribute_id should have type _keyword_.


_vue-storefront-api/config/elastic.schema.attribute.json_:
```
{
    "properties": {
        "id": {
            "type": "long"
        },
        "attribute_id": {
            "type": "keyword"
        },
        "options": {
            "properties": {
                "value": {
                    "type": "keyword"
                }
            }
        }
    }
}
```
attribute_id, value should habe type _keyword_.