import AbstractUserProxy from '../abstract/user'
import { multiStoreConfig } from './util'
import {ShopwareClient} from "./shopware-api-client";

class UserProxy extends AbstractUserProxy {
  constructor (config, req){
    super(config, req)
    this.api = ShopwareClient(multiStoreConfig(config.shopware.api, req));
  }
  register (userData) {
    return this.api.user.create(userData)
  }
  login (userData) {
    return this.api.user.login(userData)
  }
  me (customerToken) {
    return this.api.user.me(customerToken)
  }
  orderHistory (customerToken, page, pageSize) {
    return this.api.user.orderHistory(customerToken, page, pageSize)
  }
  creditValue (customerToken) {
    return this.api.user.creditValue(customerToken)
  }
  refillCredit (customerToken, creditCode) {
    return this.api.user.refillCredit(customerToken, creditCode)
  }
  resetPassword (emailData) {
    return this.api.user.resetPassword(emailData)
  }
  update (userData) {
    return this.api.user.update(userData)
  }
  changePassword (passwordData) {
    return this.api.user.changePassword(passwordData)
  }
}

module.exports = UserProxy
