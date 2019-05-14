import AbstractOrderProxy from '../abstract/order'
import { multiStoreConfig } from './util'
import { ShopwareClient } from './module/index';

class OrderProxy extends AbstractOrderProxy {
    constructor (config, req){
        super(config, req)
        this.api = ShopwareClient(multiStoreConfig(config.shopware.api, req));
      }

  create (orderData,  cartId, cartItem) {
      const inst = this

      return this.api.order.create(orderData, cartId, cartItem);
  }
}

module.exports = OrderProxy
