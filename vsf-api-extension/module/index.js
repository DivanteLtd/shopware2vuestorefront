const RestClient = require('./lib/rest_client').RestClient;
const user = require('./lib/user');
const cart = require('./lib/cart');
const order = require('./lib/order');
const stock = require('./lib/stock');
const contact = require('./lib/contact');
const wishlist = require('./lib/wishlist');
const stockAlert = require('./lib/stock_alert');
const newsletter = require('./lib/newsletter');
const address = require('./lib/address');

const SHOPWARE_API_VERSION = 'v1';

module.exports.ShopwareClient = function (options) {
  let instance = {
    addMethods (key, module) {
      let client = RestClient(options);
      if (module) {
        if (this[key])
          this[key] = Object.assign(this[key], module(client));
        else
          this[key] = module(client);
      }
    }
  };

  options.version = SHOPWARE_API_VERSION;

  let client = RestClient(options);

  instance.user = user(client);
  instance.order = order(client);
  instance.cart = cart(client);
  instance.stock = stock(client);
  instance.contact = contact(client);
  instance.wishlist = wishlist(client);
  instance.stockAlert = stockAlert(client);
  instance.newsletter = newsletter(client);
  instance.address = address(client);

  return instance;
};
