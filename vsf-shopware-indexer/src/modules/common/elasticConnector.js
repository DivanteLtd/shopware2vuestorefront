const { Client } = require('@elastic/elasticsearch')
const { host, port, indexName } = require('../../../config').elasticsearch
const client = new Client({
  node: `http://${host}:${port}`,
})

const insertDocument = (type, document) => client.create({
  index: indexName,
  type: type,
  id: document.id,
  body: document,
})

const updateDocument = (type, document) => client.update({
  index: indexName,
  type: type,
  id: document.id,
  body: { 
    doc: document
  }
})

const insertCategory = async category => await insertDocument('category', category)
const insertCategories = async categories => {
  for (const category of categories) {
    if (!category) {
      //console.log(category)
      continue;
    }
    try {
      await insertCategory(category)
      console.log(`category ${category.name} inserted.`)
    } catch (e) {
      //console.log(e)
      if (!e.meta) {
        //console.log(category)
      }
      if (e.meta.statusCode === 409) { // document already exists; force update.
        await updateDocument('category', category)
        console.log(`updated category: ${category.name}`)
      }
    }
  }
}

const insertProduct = async product => await insertDocument('product', product)
const insertProducts = async products => {
  for (const product of products) {
    try {
      //console.log(product)
      await insertProduct(product)
      console.log(`product ${product.name} inserted.`)
    } catch (e) {
      //console.log(e.body.error)
      if (e.meta.statusCode === 409) { // document already exists; force update.
        await updateDocument('product', product)
        console.log(`updated product: ${product.name}`)
      }
    }
  }
}

const insertAttribute = async attribute => await insertDocument('attribute', attribute)
const insertAttributes = async attributes  => {
  for (const attribute of attributes) {
    try {
      //console.log(attribute)
      await insertAttribute(attribute)
      console.log(`attribute ${attribute.name} inserted.`)
    } catch (e) {
      //console.log(e.body.error)
      if (e.meta.statusCode === 409) { // document already exists; force update.
        await updateDocument('attribute', attribute)
        console.log(`updated attribute: ${attribute.name}`)
      }
    }
  }
}

module.exports = {
  insertCategory,
  insertCategories,
  insertProducts,
  insertAttributes
}