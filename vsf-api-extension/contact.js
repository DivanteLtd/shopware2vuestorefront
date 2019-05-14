import AbstractContactProxy from '../abstract/contact';
import { multiStoreConfig } from './util';
import { ShopwareClient } from './module/index';

class ContactProxy extends AbstractContactProxy {
  constructor (config, req){
    super(config, req)
    this.api = ShopwareClient(multiStoreConfig(config.shopware.api, req));
  }
  submit (form) {
    return this.api.contact.submit(form);
  }
}

module.exports = ContactProxy;
