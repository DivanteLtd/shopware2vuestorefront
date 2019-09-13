## FAQ

Based on the success of `shopware2vuestorefront` integration Shopware and Divante are working on the next version of enhanced, native and dedicated PWA for Shopware. It will be Open Source (MIT) and will be released in **Q2 2020**.

### Shopware PWA - advanced integration

This initial integration got so popular that after talks with Shopware we decided to start the native integration project that will be called **"Shopware PWA powered by Vue Storefront"** and will take advantage of native Shopware data format. This will allow us to fully leverage the CMS (Customer Experiences) that are not compliant with the default Vue Storefront data formats.

These two different strategies for the integration are described in our integration SDK:  https://github.com/DivanteLtd/vue-storefront-integration-sdk/blob/tutorial/Vue%20Storefront%20Integration%20Architecture.pdf

We're now taking a huge step from the current **`shopware2vuestorefront` - Generic integration** into **`shopware-pwa` - Direct/native integration**. This is opening whole new perspectives!

### Does it makes sense for this integration to exist along `shopware-pwa`?

Sure! We're looking for active contributors and maintainers as we still see a value in this integration and it might be usefull even along with `shopware-pwa` project after it will be released. Shopware PWA will be dedicated to the client's / developers familiar with Shopware. In case somebody is working on Vue Storefront but different platform, having this `shopware2vuestorefront` integration can be really cool. 

By having it they will be able to work on the exactly same data formats with any given platform - being ready to build shops on client's platform of choice by single team. This is exactly the way other integrations have been done - including [spree2vuestorefront](https://github.com/spark-solutions/spree2vuestorefront).

Vue Storefront 1.0 architecture won't let us fully integrate - therefore this leapfrog is a required development step. There will be no easy way to migrate from `shopware2vuestorefront` to `shopware-pwa` as the data formats will change.

### Can I still use [`shopware2vuestorefront`](https://github.com/DivanteLtd/shopware2vuestorefront) for my commercial project?

Yes you can, however, this integration is limited in features; we're not yet supporting the coolest Shopware6 feature which is "Customer Experiences" (Pagebuilder) -> see the [ToDo List](https://github.com/DivanteLtd/shopware2vuestorefront#what-makes-it-unique).

These features can be added by your agency if the project dates require you to start right away. If the client can wait - it's better to wait for more advanced integration that we're currently building

### How it relates to Vue Storefront 2.0?

The `shopware2vuestorefont` project is dedicated to Vue Storefront 1.11. Vue Storefront 1.x will be covered by Long Term Support by 1-2 years. The  `shopware-pwa` is being built on Vue Storefront 2.0. More than using just the native data formats it will be based on StorefrontUI (http://storefrontui.io) implementing the best of Google Retail playbook strategies. It's worth waiting for it!

### Will the `shopware2vuestorefront` be actively maintained/developed?
We're now fully focused on `shopware-pwa`, looking forward to finding community-based maintainers taking care of `shopware2vuestorefront`, however, it's hard for us to say.

### When can I start using `shopware-pwa`
We're starting 1st October and we need roughly 5-6 months to finish the project; Probably starting next year (January) there will be a developer's preview version. Shopware PWA will be MIT licensed, we're happy for any contributor to join the project even before the first release 

