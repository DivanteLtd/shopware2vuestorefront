function isNumeric(val) {
  return Number(parseFloat(val)).toString() === val;
}

module.exports = function (restClient) {
  let module = {};
  const urlPrefix = 'checkout/';
  let url = urlPrefix;
  function getResponse(data){
    if(data.code === 200){
      return data.result;
    }
    return false;
  }
  module.create = (customerToken) => {
    url += `cart`;
    console.log('setting new token for customer: ', customerToken)
    return restClient.post(url, {}, customerToken).then((data)=> {
      return getResponse({
        code: 200,
        result: data['sw-context-token']
      });
    });
  }
  var dateFromObjectId = function (objectId) {
    return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
  };

  module.update = async (customerToken, cartId, cartItemModel) => {
    let { sku, qty } = cartItemModel
      if (cartItemModel.product_option.extension_attributes.configurable_item_options.length) { // find the specific variant
        const optionIds = cartItemModel.product_option.extension_attributes.configurable_item_options.map(({option_value}) => option_value)
        if (optionIds.length) {
          // TODO: move query builder to other module
          const optionIdQueries = optionIds.map(optionId => ({
            field: "optionIds",
            type: "contains",
            value: `${optionId}`
          }))
          const variantProductQuery = {
            "filter": [
              {
              "field": "parentId",
              "type": "equals",
              "value": sku
              },
              {
                "field": "optionIds",
                "type": "multi",
                "queries": optionIdQueries
              }
          ]}

          const variantProductResponse = await restClient.post(`product`, variantProductQuery)
          // replace sku with the child/variant SKU
          sku = variantProductResponse.data[0].id
        }
      }
      return restClient.post(url + `cart/product/${sku}`, { quantity: qty }, cartId).then((data)=> {
        const response = data.data.lineItems.filter(item => item.id == sku).map(item => ({
               "item_id": dateFromObjectId(item.id).getTime(),
               "sku":item.id,
               "qty":item.quantity,
               "name":item.label,
               "price":item.price.totalPrice,
               "product_type": "simple",
               "quoteId": cartId
            
        }))
        return getResponse({result: response[0], code: 200});
    })
}

  module.applyCoupon = (customerToken, cartId, coupon) => {
    url += `applyCoupon?token=${customerToken}&cartId=${cartId}&coupon=${coupon}`;
    return restClient.post(url).then((data)=> {
      return getResponse(data);
    });
  }
  module.deleteCoupon = (customerToken, cartId) => {
    url += `deleteCoupon?token=${customerToken}&cartId=${cartId}`;
    return restClient.post(url).then((data)=> {
      return getResponse(data);
    });
  }
  module.delete = (customerToken, cartId, cartItem) => {
    url += `cart/line-item/${cartItem.sku}`;
    return restClient.delete(url, cartId).then((data)=> {
      return getResponse(data);
    })
  }
  module.pull = (customerToken, cartId) => {
    url += `cart`;
    return restClient.get(url, cartId).then((data)=> {
    const items = data.data.lineItems

    const response = items.map(item => ({
        "item_id": dateFromObjectId(item.id).getTime(),
        "sku":item.id,
        "qty":item.quantity,
        "name":item.label,
        "price":item.price.totalPrice,
        "product_type": "simple",
        "quoteId": cartId
    }))
      return getResponse({
        code: 200,
        result: response,
        
      });
    });
  }
  module.totals = (customerToken, cartId) => {
    url += `cart`;
    return restClient.get(url, cartId).then((data)=> {
      const items = data.data.lineItems
      const result = {
        "grand_total": data.data.price.totalPrice,
        "base_grand_total": data.data.price.totalPrice,
        "subtotal": data.data.price.positionPrice,
        "base_subtotal": data.data.price.positionPrice,
        "discount_amount": 0,
        "base_discount_amount": 0,
        "subtotal_with_discount": 0,
        "base_subtotal_with_discount": 0,
        "shipping_amount": data.data.deliveries[0].shippingCosts.totalPrice, // TODO: find specific price from proper delivery, not default one. here and below
        "base_shipping_amount": data.data.deliveries[0].shippingCosts.totalPrice,
        "shipping_discount_amount": 0,
        "base_shipping_discount_amount": 0,
        "tax_amount": data.data.price.calculatedTaxes[0].tax,
        "base_tax_amount": 0,
        "weee_tax_applied_amount": null,
        "shipping_tax_amount": 0,
        "base_shipping_tax_amount": 0,
        "subtotal_incl_tax": 0,
        "base_subtotal_incl_tax": 0,
        "shipping_incl_tax": data.data.deliveries[0].shippingCosts.totalPrice,
        "base_shipping_incl_tax": 0,
        "base_currency_code": "USD",
        "quote_currency_code": "USD",
        "items_qty": items.length,
        "items": items.map(item => ({
      
          "item_id": dateFromObjectId(item.id).getTime(),
          "sku":item.id,
          "qty":item.quantity,
          "name":item.label,
          "price":item.price.totalPrice,
          "product_type": "simple",
          "quote_id": cartId
        
      }))
      }

      return getResponse({
        code: 200,
        result: result
      });
    });
  }
  module.shippingInformation = async (customerToken, cartId, body) => {
    url += `cart`;

    const shippingCode = body.addressInformation.shippingMethodCode

    /** TODO: uncomment lines above when patching context is available
    const response = await restClient.patch(
      'context',
      {
          shippingMethodId: shippingCode
      },
      cartId
    )**/

    return restClient.get(url, cartId).then(async (data) => {

      const paymentMethodsResponse = await restClient.get('payment-method' , {}. cartId)
      const paymentMethods = paymentMethodsResponse.data
      try {
        const items = data.data.lineItems
        const result = {
              "payment_methods": paymentMethods.map(({name, id}) => ({
                code: id,
                title: name
              })),
              "totals": {
                "total_segments": [
                  {
                    code: "subtotal",
                    title: "Subtotal",
                    value: data.data.price.positionPrice
                  },
                  {
                    code: "grand_total",
                    title: "Grand Total",
                    value:  data.data.price.totalPrice
                  },
                ],
                "grand_total": data.data.price.totalPrice,
                "base_grand_total": data.data.price.totalPrice,
                "subtotal": data.data.price.positionPrice,
                "base_subtotal": data.data.price.positionPrice,
                "discount_amount": 0,
                "base_discount_amount": 0,
                "subtotal_with_discount": 0,
                "base_subtotal_with_discount": 0,
                "shipping_amount": data.data.deliveries[0].shippingCosts.totalPrice, // TODO: find specific price from proper delivery, not default one. here and below
                "base_shipping_amount": data.data.deliveries[0].shippingCosts.totalPrice,
                "shipping_discount_amount": 0,
                "base_shipping_discount_amount": 0,
                "tax_amount": data.data.price.calculatedTaxes[0].tax,
                "base_tax_amount": data.data.price.calculatedTaxes[0].tax,
                "weee_tax_applied_amount": null,
                "shipping_tax_amount": 0,
                "base_shipping_tax_amount": 0,
                "subtotal_incl_tax": data.data.price.positionPrice,
                "base_subtotal_incl_tax":data.data.price.positionPrice,
                "shipping_incl_tax": data.data.deliveries[0].shippingCosts.totalPrice,
                "base_shipping_incl_tax": data.data.deliveries[0].shippingCosts.totalPrice,
                "base_currency_code": "USD",
                "quote_currency_code": "USD",
                "items_qty": items.reduce((sum, item) => sum+item.quantity, 0),
                "items": await Promise.all(items.map(async item => {

                    const response = await restClient.get(`product/${item.id}`)
                    const product = response.data

                    return {
                      "item_id":dateFromObjectId(item.id).getTime(),
                      "sku": item.id,
                      "qty":item.quantity,
                      "name":item.label,
                      "price": product.price.gross,
                      "base_price": product.price.gross,
                      "row_total":item.price.totalPrice,
                      "row_total_incl_tax":item.price.totalPrice,
                      "product_type": "simple",
                      "quoteId": cartId
                    }
                  }
                ))
              }
            }
          return getResponse({
            code: 200,
            result: result
          })
          } catch (e) {
            return getResponse({
              code: 200,
              result: e
            })
          }
        });

  }

  module.shippingMethods = (customerToken, cartId, address) => {
    url = `shipping-method`;
    return restClient.get(url , {}. cartId).then((data)=> {
      return getResponse({
        code: 200,
        result: data.data.map(({name, active, id, priceRules}) => ({ // TODO: find specific price from proper priceRule, not default one
            "carrier_code":id,
            "method_code":id,
            "carrier_title":name,
            "method_title":name,
            "amount": priceRules ? priceRules[0].price : 0,
            "base_amount":priceRules ? priceRules[0].price: 0,
            "available":active,
            "error_message":"",
            "price_excl_tax": priceRules ? priceRules[0].price: 0,
            "price_incl_tax": priceRules ? priceRules[0].price: 0,
        }))
      });
    });
  }
  module.paymentMethods = (customerToken, cartId) => {
    url = `payment-method`;
    return restClient.get(url, cartId).then((data)=> {
      const paymentMethods = data.data
      const result = paymentMethods.map(method => ({
        title: method.name,
        code: method.id
      }))
     
      return getResponse({
        code: 200,
        result: result,
      });
    });
  }
  module.getCoupon = (customerToken, cartId) => {
    url += `coupon?token=${customerToken}&cartId=${cartId}`;
    return restClient.get(url).then((data)=> {
      return getResponse(data);
    });
  }
  return module;
}
