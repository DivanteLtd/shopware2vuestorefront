const { get } = require('../common/apiConnector')
const transform = require('./template')

const transformedCategory = async (category) => transform(category)

module.exports = transformedCategory