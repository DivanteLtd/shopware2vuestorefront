import AbstractWishlistProxy from '../abstract/wishlist';
import { multiStoreConfig } from './util';
import { ShopwareClient } from './shopware-api-client';

class WishlistProxy extends AbstractWishlistProxy {
  constructor (config, req){
    super(config, req)
    this.api = ShopwareClient(multiStoreConfig(config.shopware.api, req));
  }
  pull (customerToken) {
    return this.api.wishlist.pull(customerToken);
  }
  update (customerToken, wishListItem) {
    return this.api.wishlist.update(customerToken, wishListItem);
  }
  delete (customerToken, wishListItem) {
    return this.api.wishlist.delete(customerToken, wishListItem);
  }
}

module.exports = WishlistProxy;
