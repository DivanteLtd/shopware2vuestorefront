const { getAdmin } = require('../common/apiConnectorAdmin')
const template = require('./template')

const extractOptions = async attributeId => {
 // if (attributeId == '351441721ffa49e7abc711f4655d6269' ) {
    console.log('------------------ color --------------:')
    const response = await getAdmin(`property-group/${attributeId}/options`)
    
    const options = response.data.data

    if (!Array.isArray(options)) {
      return []
    }
   // console.log(options)
    return result  = options.map(option => ({
      label: option.name,
      value: option.id
    }))
 // }
}

const transformedAttribute = async (attribute) => template(attribute, await extractOptions(attribute.id))

module.exports = transformedAttribute