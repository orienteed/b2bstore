module.exports = targets => {
    const builtins = targets.of('@magento/pwa-buildpack');

    builtins.specialFeatures.tap(features => {
        features[targets.name] = {
            esModules: true,
            cssModules: true,
            i18n: true,
            graphqlQueries: true
        };
    });
};
