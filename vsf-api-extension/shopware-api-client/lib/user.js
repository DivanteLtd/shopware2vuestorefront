//TODO add required fields' validation
const convertAddress = ({id, customerId, country, city, firstName, lastName, zipcode, street, phoneNumber, additionalAddressLine1, additionalAddressLine2 }, isShipping = true) => ({
  "id": id,
  "customer_id": customerId,
  "region":
  {
    "region_code": null,
    "region": null,
    "region_id": 0
  },
  "region_id": 0,
  "country_id": country.iso,
  "street": [street, additionalAddressLine1, additionalAddressLine2].filter(item => !!item),
  "telephone": phoneNumber ? phoneNumber : "",
  "postcode": zipcode ? zipcode : "",
  "city": city,
  "firstname": firstName,
  "lastname": lastName,
  "default_shipping": isShipping
})


module.exports = function (restClient) {
  let module = {};
  let url = 'customer/';
  function getResponse(data){
    if (data.code === 200){
      return data.result;
    }

    return data.result;
  }
  module.login = (userData) => {
    url += 'login';
    return restClient.post(url, userData).then((data)=> {
      let response = {
        code: 500,
        result: 'You did not sign in correctly or your account is temporarily disabled.'
      }
      if (data['sw-context-token']) {
        response.result = data['sw-context-token']
        response.code = 200
      }
      return getResponse(response);
    });
  }
  module.resetPassword = function (emailData) {
    url += `resetPassword`;
    return restClient.post(url, {email: emailData.email}).then((data)=> {
      return getResponse(data);
    });
  }
  module.changePassword = function (passwordData) {
    url += `changePassword?token=${passwordData.token}`;
    return restClient.post(url, passwordData.body).then((data)=> {
      return getResponse(data);
    });
  }
  const search = (type, filter, token) => {

    return restClient.post(`${type}?response=true`, {
      filter: [{
          field: filter.identifier ? filter.identifier : 'name',
          type: 'equals',
          value: filter.value
      }]
    }, token)
  }

  module.create = async (userData) => {
    // TODO: replace with real one country ID when it will come from fronted
    const countryResponse = await search('country', { identifier: 'iso', value: 'PL' })
    const countryId = countryResponse.data.shift().id
    // TODO: discover salutation from customer's name
    const salutationResponse = await search('salutation', { identifier: 'displayName', value: 'Mr.' })
    const salutationId = salutationResponse.data.shift().id

    // TODO: replace with real data when they will come from frontend
    const customer = {
      "salutationId": salutationId,
      "firstName": userData.customer.firstname,
      "lastName": userData.customer.lastname,
      "email": userData.customer.email,
      "password": userData.password,
      "billingAddress": {
        "salutationId": salutationId,
        "firstName": userData.customer.firstname,
        "lastName": userData.customer.lastname,
        "street": "-",
        "zipcode": "-",
        "city": "-",
        "countryId": countryId
      }
    }    
    let response = {
      code: 500,
      result: 'Something went wrong'
    }

    return restClient.post('customer', customer).then((data)=> {
      if (typeof data.data != 'undefined') {
        response.code = 200
        response.result = data.data
      } 
      return getResponse(response);
    });
  }
  module.creditValue = function (customerToken) {
    const getCreditUrl = `user_credit/get?token=${customerToken}`

    return restClient.get(getCreditUrl).then((data)=> {
      return getResponse(data);
    });
  }
  module.refillCredit = function (customerToken, creditCode) {
    const getCreditUrl = `user_credit/refill?token=${customerToken}`

    return restClient.post(getCreditUrl, {credit_code: creditCode}).then((data)=> {
      return getResponse(data);
    });
  }
  module.orderHistory = function (customerToken, page, pageSize) {
    url += `order`;
    return restClient.get(url, customerToken).then((data)=> {
      const orders = []
      for (const orderId in data.data) {
        if (data.data.hasOwnProperty(orderId)) {
          const { amountTotal, shippingTotal, positionPrice, billingAddressId, orderCustomer, updatedAt, autoIncrement, stateMachineState, orderDate,  } = data.data[orderId]
          // TODO: handle taxes, other payment methods, currencies and other details.
          orders.push({
            "applied_rule_ids": "",
            "base_currency_code": "USD",
            "base_discount_amount": 0,
            "base_grand_total": amountTotal,
            "base_discount_tax_compensation_amount": 0,
            "base_shipping_amount": shippingTotal,
            "base_shipping_discount_amount": 0,
            "base_shipping_incl_tax": shippingTotal,
            "base_shipping_tax_amount": 0,
            "base_subtotal": positionPrice,
            "base_subtotal_incl_tax": positionPrice,
            "base_tax_amount": 0,
            "base_total_due": 0,
            "base_to_global_rate": 1,
            "base_to_order_rate": 1,
            "billing_address_id": billingAddressId,
            "created_at": orderDate,
            "customer_email": orderCustomer.email,
            "customer_group_id": 0,
            "customer_is_guest": 1,
            "customer_note_notify": 1,
            "discount_amount": 0,
            "email_sent": 1,
            "entity_id": autoIncrement,
            "global_currency_code": "USD",
            "grand_total": amountTotal,
            "discount_tax_compensation_amount": 0,
            "increment_id": autoIncrement,
            "is_virtual": 0,
            "order_currency_code": "USD",
            "protect_code": "3984835d33abd2423b8a47efd0f74579",
            "quote_id": 1112,
            "shipping_amount": 5,
            "shipping_description": "Flat Rate - Fixed",
            "shipping_discount_amount": 0,
            "shipping_discount_tax_compensation_amount": 0,
            "shipping_incl_tax": 5,
            "shipping_tax_amount": 0,
            "state": stateMachineState.technicalName,
            "status":  stateMachineState.technicalName,
            "store_currency_code": "USD",
            "store_id": 1,
            "store_name": "Main Website\nMain Website Store\n",
            "store_to_base_rate": 0,
            "store_to_order_rate": 0,
            "subtotal": positionPrice,
            "subtotal_incl_tax": amountTotal,
            "tax_amount": 0,
            "total_due": 0,
            "total_item_count": 1,
            "total_qty_ordered": 1,
            "updated_at": updatedAt,
            "weight": 1,
            "items": [ // TODO: manage order' items
            ],
            "billing_address": {},
            "payment": {
              "account_status": null,
              "additional_information": [
                "Cash On Delivery",
                ""
              ],
              "amount_ordered": 0,
              "base_amount_ordered": 0,
              "base_shipping_amount": 0,
              "cc_last4": null,
              "entity_id": 102,
              "method": "cashondelivery",
              "parent_id": 102,
              "shipping_amount": 5
            }
          }
          )
        }

      }

      return getResponse({
        code: 200,
        result: {
          items: orders,
          total_count: orders.length
        }
      });
    });
  }
  module.update = async function (userData) {
    const { customer } = userData.body
    const countryResponse = await search('country', { identifier: 'iso', value: customer.addresses[0].country_id })
    const countryId = countryResponse.data.shift().id
    const salutationResponse = await search('salutation', { identifier: 'displayName', value: 'Mr.' })
    const salutationId = salutationResponse.data.shift().id

    // TODO: create and replace new address until PATCH method of existing address is available
    const { data } = await restClient.post(`customer/address`, {
      "firstName": customer.addresses[0].firstname,
      "lastName": customer.addresses[0].lastname,
      "street": customer.addresses.length>0 ? customer.addresses[0].street[0] : "",
      "additionalAddressLine1": customer.addresses.length>0 ? customer.addresses[0].street[1] : null,
      "additionalAddressLine2": customer.addresses.length>0 ? customer.addresses[0].street[2] : null,
      "zipcode": customer.addresses.length>0 ? customer.addresses[0].postcode : "",
      "city": customer.addresses.length>0 ? customer.addresses[0].city : "",
      "phoneNumber":  customer.addresses.length>0 ? customer.addresses[0].telephone : "",
      "countryId": countryId,
      "salutationId": salutationId
    }, userData.token)

    await restClient.patch(`customer/address/${data}/default-shipping`, {}, userData.token)
    await restClient.patch(`customer/address/${data}/default-billing`, {}, userData.token)

    const newData = {
      "firstName": customer.firstname,
      "lastName": customer.lastname,
      "salutationId": salutationId,
      "email": customer.email
    }

    return restClient.patch('customer', newData , userData.token).then((data)=> {
      return getResponse({
        code: 200,
        result: data
      });
    });
  }
  module.me = function (customerToken) {
    return restClient.get(url, customerToken).then((data)=> {
      const { id, firstName, lastName, createdAt, updatedAt, email, defaultBillingAddress, defaultShippingAddress} = data.data
      const response = {
        "code": 200, 
        "result" : {
          "id": id,
          "group_id": 1,
          "default_shipping": defaultShippingAddress.id,
          "created_at": createdAt,
          "updated_at": updatedAt,
          "created_in":"Default Store View",
          "email": email,
          "firstname": firstName,
          "lastname": lastName,
          "store_id": 1,
          "website_id": 1,
          "addresses": [],
          "disable_auto_group_change": 0
        }
      }
      response.result.addresses.push(convertAddress(defaultShippingAddress))

      return getResponse(response);
    });
  }
  return module;
}
