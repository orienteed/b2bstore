module.exports = (targets) => {
    const { specialFeatures } = targets.of("@magento/pwa-buildpack");
    specialFeatures.tap((flags) => {
        flags[targets.name] = {
            esModules: true,
            cssModules: true,
            graphqlQueries: true,
        };
    });

    /** Registers Our Payment Method **/
    const { checkoutPagePaymentTypes } = targets.of("@magento/venia-ui");
    checkoutPagePaymentTypes.tap((payments) =>{
        
        payments.add({
            paymentCode: "banktransfer",
            importPath: "@orienteed/payWithBankTransfer/src/components/bankTransfer.js"
        })
    });
};