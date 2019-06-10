const { Client } = require('@elastic/elasticsearch')
const { host, port, indexName } = require('../../../config').elasticsearch
const client = new Client({
  node: `http://${host}:${port}`,
})
const { timeout } = require('./helper')

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
    if (typeof category.id == 'undefined') {
      continue;
    }
    if (!category) {
      continue;
    }
    try {
      await insertCategory(category)
      console.log(`category ${category.name} inserted.`)
    } catch (e) {
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
    if (product && typeof product.id == 'undefined') {
      continue;
    }
    try {
      await timeout(100)
      await insertProduct(product)
      console.log(`product ${product.name} inserted.`)
    } catch (e) {
      if (e.meta && e.meta.statusCode === 409) { // document already exists; force update.
        await updateDocument('product', product)
        console.log(`updated product: ${product.sku}`)
      }

      if (e.meta && e.meta.statusCode === 400) {
          console.log(e.meta.body.error)
      }
    }
  }
}

const insertAttribute = async attribute => await insertDocument('attribute', attribute)
const insertAttributes = async attributes  => {
  for (const attribute of attributes) {
    if (typeof attribute.id == 'undefined') {
      continue;
    }
    try {
      await insertAttribute(attribute)
      console.log(`attribute ${attribute.name} inserted.`)
    } catch (e) {
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