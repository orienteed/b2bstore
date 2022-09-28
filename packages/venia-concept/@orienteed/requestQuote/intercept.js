module.exports = targets => {
    if (process.env.B2BSTORE_VERSION === 'PREMIUM') {
        const { specialFeatures } = targets.of('@magento/pwa-buildpack');
        specialFeatures.tap(flags => {
            flags[targets.name] = {
                esModules: true,
                cssModules: true,
                graphqlQueries: true
            };
        });

        // Routes
        targets.of('@magento/venia-ui').routes.tap(routes => {
            routes.push(
                {
                    name: 'My Quotes',
                    pattern: '/mprequestforquote/customer/quotes',
                    path: '@orienteed/requestQuote/src/components/Customer/Quotes'
                },
                {
                    name: 'My Quote Cart',
                    pattern: '/mprequestforquote/quoteCart',
                    path: '@orienteed/requestQuote/src/components/QuoteCartPage'
                },
                {
                    name: 'Thank you',
                    pattern: '/mprequestforquote/quoteCart/success/:id',
                    path: '@orienteed/requestQuote/src/components/QuoteCartPage/QuoteSuccess'
                }
            );
            return routes;
        });
    }
};
