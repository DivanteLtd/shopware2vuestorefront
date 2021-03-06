import AbstractAddressProxy from '../abstract/address'
import {multiStoreConfig} from "./util";
import {ShopwareClient} from "./shopware-api-client";

class AddressProxy extends AbstractAddressProxy {
  constructor (config, req){
    super(config, req)
    this.api = ShopwareClient(multiStoreConfig(config.magento1.api, req));
  }
  list (customerToken) {
    return this.api.address.list(customerToken)
  }
  update (customerToken, addressData) {
    return this.api.address.update(customerToken, addressData);
  }
  get (customerToken, addressId) {
    return this.api.address.get(customerToken, addressId)
  }
  delete (customerToken, addressData) {
    return this.api.address.delete(customerToken, addressData)
  }
}

module.exports = AddressProxy
