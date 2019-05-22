module.exports = function (restClient) {
  let module = {};
  const urlPrefix = 'product/';
  let url = urlPrefix;
  function getResponse(data){
    if(data.code === 200){
      return data.result;
    }
    return false;
  }
  module.check = (sku) => {
    url += `${sku}`;
    return restClient.get(url).then((data)=> {
      const product = data.data
      return getResponse({
        code: 200,
        result: {
          "item_id": product.autoIncrement,
          "product_id": product.autoIncrement,
          "sku": sku,
          "stock_id": product.autoIncrement,
          "qty": product.stock,
          "is_in_stock": !!product.stock,
        }
      });
    });
  };
  return module;
};
