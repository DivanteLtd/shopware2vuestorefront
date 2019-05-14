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
  module.create = function (userData) {
    
    const customer = {
      "salutationId": "2029ecc299d64a2d8d69ccf158e41e75",
      "firstName": userData.customer.firstname,
      "lastName": userData.customer.lastname,
      "email": userData.customer.email,
      "password": userData.password,
      "billingAddress": {
        "salutationId": "2029ecc299d64a2d8d69ccf158e41e75",
        "firstName": userData.customer.firstname,
        "lastName": userData.customer.lastname,
        "street": "-",
        "zipcode": "-",
        "city": "-",
        "countryId": "98c861038e1e4f4abfd60a4616ca13fc"
      }
    }

    console.log(customer)
    
    let response = {
      code: 500,
      result: 'Something went wrong'
    }

    return restClient.post('customer', customer).then((data)=> {
      console.log(data)
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
      console.log(data.data)
      return getResponse(data);
    });
  }
  module.update = function (userData) {
    url += `me?token=${userData.token}`
    return restClient.post(url, userData.body).then((data)=> {
      return getResponse(data);
    });
  }
  module.me = function (customerToken) {
    return restClient.get(url, customerToken).then((data)=> {
      const { id, firstName, lastName, createdAt, updatedAt, email, defaultBillingAddress, defaultShippingAddress} = data.data
      const response = {
        "code": 200, 
        "result" : {
          "id":id,
          "group_id":1,
          "default_shipping":"67",
          "created_at":createdAt,
          "updated_at":updatedAt,
          "created_in":"Default Store View",
          "email":email,
          "firstname":firstName,
          "lastname":lastName,
          "store_id":1,
          "website_id":1,
          "addresses":[],
          "disable_auto_group_change":0
        }
    }
      return getResponse(response);
    });
  }
  return module;
}
