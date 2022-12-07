module.exports = targets => {
    const builtins = targets.of('@magento/pwa-buildpack');

    builtins.specialFeatures.tap(features => {
        features[targets.name] = {
            esModules: true,
            cssModules: true,
            graphqlQueries: true
        };
    });
    // Routes
    process.env.B2BSTORE_VERSION === 'PREMIUM' &&
        targets.of('@magento/venia-ui').routes.tap(routes => {
            routes.push(
                {
                    name: 'Company Account Information',
                    pattern: '/company-account/information',
                    path: '@orienteed/companyAccount/src/components/CompanyInfo/companyInfo'
                },
                {
                    name: 'Company Account Users',
                    pattern: '/company-account/users',
                    path: '@orienteed/companyAccount/src/components/CompanyUsers/companyUsers'
                },
                {
                    name: 'Company Account Orders',
                    pattern: '/company-account/orders',
                    path: '@orienteed/companyAccount/src/components/CompanyOrders/companyOrders'
                },
                {
                    name: 'Company Account User Roles',
                    pattern: '/company-account/userRoles',
                    path: '@orienteed/companyAccount/src/components/UserRoles/userRoles'
                }
            );
            return routes;
        });
};
