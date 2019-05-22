import AbstractUserProxy from '../abstract/user';
import { multiStoreConfig } from './util';
import { ShopwareClient } from './shopware-api-client';

class StockProxy extends AbstractUserProxy {
  constructor (config, req){
    super(config, req)
    this.api = ShopwareClient(multiStoreConfig(config.shopware.api, req));
  }
  check (sku) {
    return this.api.stock.check(sku);
  }
}

module.exports = StockProxy;
