module.exports = targets => {
    const builtins = targets.of('@magento/pwa-buildpack');

    builtins.specialFeatures.tap(features => {
        features[targets.name] = {
            esModules: true,
            cssModules: true,
            graphqlQueries: true
        };
    });

    targets.of('@magento/venia-ui').routes.tap(routes => {
        routes.push(
            {
                name: 'CreateAccountNonCustomer',
                pattern: '/create-account-non-customer',
                path:
                    '@orienteed/customComponents/components/CreateAccountNonCustomer'
            },
            {
                name: 'CreateAccountBeCustomer',
                pattern: '/create-account-be-customer',
                path:
                    '@orienteed/customComponents/components/CreateAccountBeCustomer'
            },
            {
                name: 'OrderIncidences',
                pattern: '/order-incidences',
                path: '@orienteed/customComponents/components/OrderIncidences'
            },
            {
                name: "Courses",
                pattern: "/learning",
                path: '@orienteed/customComponents/components/CoursesCatalog'
            }
        );
        return routes;
    });
};
