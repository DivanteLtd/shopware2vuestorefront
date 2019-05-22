const { getAdmin, postAdmin } = require('../common/apiConnectorAdmin')
const template = require('./template')

const extractOptions = async attributeId => {
  
    const response = await postAdmin(`search/property-group/${attributeId}/options`, {"page":1,"limit":50}, true)
    const options = response.data.data

    if (!Array.isArray(options)) {
      return []
    }
    return result  = options.map(option => ({
      label: option.name,
      value: option.id
    }))
  
}

const transformedAttribute = async (attribute) => template(attribute, await extractOptions(attribute.id))

module.exports = transformedAttribute