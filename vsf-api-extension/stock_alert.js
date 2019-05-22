import AbstractStockAlertProxy from '../abstract/stock_alert';
import { multiStoreConfig } from './util';
import { ShopwareClient } from './shopware-api-client';

class StockAlertProxy extends AbstractStockAlertProxy {
  constructor (config, req){
    super(config, req)
    this.api = ShopwareClient(multiStoreConfig(config.shopware.api, req));
  }
  subscribe (customerToken, productId, emailAddress) {
    return this.api.stockAlert.subscribe(customerToken, productId, emailAddress);
  }
}

module.exports = StockAlertProxy;
