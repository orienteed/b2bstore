module.exports = componentOverrideMapping = {
    //JS
    [`@magento/venia-ui/lib/RootComponents/Category/categoryContent.js`]: './src/RootComponents/Category/categoryContent.js',
    [`@magento/venia-ui/lib/components/App/contextProvider.js`]: './src/components/App/contextProvider.js',
    [`@magento/venia-ui/lib/components/CartPage/PriceSummary/priceSummary.js`]: './src/components/CartPage/PriceSummary/priceSummary.js',
    [`@magento/venia-ui/lib/components/CartPage/ProductListing/productListing.js`]: './src/components/CartPage/ProductListing/productListing.js',
    [`@magento/venia-ui/lib/components/CartPage/ProductListing/quantity.js`]: './src/components/ProductListing/quantity.js',
    [`@magento/venia-ui/lib/components/CartPage/cartPage.js`]: './src/components/CartPage/cartPage.js',
    [`@magento/venia-ui/lib/components/CommunicationsPage/communicationsPage.js`]: './src/components/CommunicationsPage/communicationsPage.js',
    [`@magento/venia-ui/lib/components/CreateAccountPage/createAccountPage.js`]: './src/components/CreateAccountPage/createAccountPage.js',
    [`@magento/venia-ui/lib/components/ErrorView/errorView.js`]: './src/components/ErrorView/errorView.js',
    [`@magento/venia-ui/lib/components/Footer/footer.js`]: './src/components/Footer/footer.js',
    [`@magento/venia-ui/lib/components/Footer/sampleData.js`]: './src/components/Footer/sampleData.js',
    [`@magento/venia-ui/lib/components/Gallery/gallery.js`]: './src/components/Gallery/gallery.js',
    [`@magento/venia-ui/lib/components/Gallery/item.js`]: './src/components/Gallery/item.js',
    [`@magento/venia-ui/lib/components/Header/header.js`]: './src/components/Header',
    [`@magento/venia-ui/lib/components/Logo/logo.js`]: './src/components/Logo/logo.js',
    [`@magento/venia-ui/lib/components/MiniCart/miniCart.js`]: './src/components/MiniCart/miniCart.js',
    [`@magento/venia-ui/lib/components/Newsletter/newsletter.js`]: './src/components/Newsletter/newsletter.js',
    [`@magento/venia-ui/lib/components/OrderHistoryPage/collapsedImageGallery.js`]: './src/components/OrderHistoryPage/collapsedImageGallery.js',
    [`@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.js`]: './src/components/ProductFullDetail/productFullDetail.js',
    [`@magento/venia-ui/lib/components/ProductOptions/options.js`]: './src/components/ProductOptions/options.js',
    [`@magento/venia-ui/lib/components/SearchBar/autocomplete.js`]: './src/components/SearchBar/autocomplete.js',
    [`@magento/venia-ui/lib/components/SearchBar/suggestedProduct.js`]: './src/components/SearchBar/suggestedProduct.js',
    [`@magento/venia-ui/lib/components/SearchBar/suggestedProducts.js`]: './src/components/SearchBar/suggestedProducts.js',
    [`@magento/venia-ui/lib/components/SignIn/signIn.js`]: './src/components/SignIn/signIn.js',
    [`@magento/venia-ui/lib/components/SignInPage/signInPage.js`]: './src/components/SignInPage/signInPage.js',
    [`@magento/venia-ui/lib/components/TextInput/textInput.js`]: './src/components/TextInput/textInput.js',
    // [`@orienteed/buyLaterNotes/components/SavedCarts/savedCartsTable.js`]: './src/components/SavedCarts/savedCartsTable.js', // replace directly,

    //TALONS
    [`@magento/peregrine/lib/talons/CartPage/PriceSummary/usePriceSummary.js`]: './src/talons/usePriceSummary.js',
    [`@magento/peregrine/lib/talons/CartPage/ProductListing/useQuantity.js`]: './src/talons/ProductListing/useQuantity.js',
    [`@magento/peregrine/lib/talons/CartPage/useCartPage.js`]: './src/talons/CartPage/useCartPage.js',
    [`@magento/peregrine/lib/talons/CreateAccount/useCreateAccount.js`]: './src/talons/CreateAccount/useCreateAccount.js',
    [`@magento/peregrine/lib/talons/Header/useAccountMenu.js`]: './src/talons/Header/useAccountMenu.js',
    [`@magento/peregrine/lib/talons/MiniCart/useMiniCart.js`]: './src/talons/MiniCart/useMiniCart.js',
    [`@magento/peregrine/lib/talons/OrderHistoryPage/useOrderHistoryPage.js`]: './src/talons/OrderHistoryPage/useOrderHistoryPage.js',
    [`@magento/peregrine/lib/talons/OrderHistoryPage/useOrderRow.js`]: './src/talons/OrderHistoryPage/useOrderRow.js',
    [`@magento/peregrine/lib/talons/ProductFullDetail/useProductFullDetail.js`]: './src/talons/ProductFullDetail/useProductFullDetail.js',
    [`@magento/peregrine/lib/talons/SignIn/useSignIn.js`]: './src/talons/SignIn/useSignIn.js',

    //GRAPHQL
    [`@magento/peregrine/lib/talons/CreateAccount/createAccount.gql.js`]: './src/talons/CreateAccount/createAccount.gql.js',
    [`@magento/peregrine/lib/talons/RootComponents/Category/categoryFragments.gql.js`]: './src/talons/RootComponents/Category/categoryFragments.gql.js',
    [`@magento/peregrine/lib/talons/RootComponents/Product/productDetailFragment.gql.js`]: './src/talons/RootComponents/Product/productDetailFragment.gql.js',
    [`@magento/peregrine/lib/talons/SearchPage/searchPage.gql.js`]: './src/talons/SearchPage/searchPage.gql.js',
    [`@magento/peregrine/lib/talons/SignIn/signIn.gql.js`]: './src/talons/SignIn/signIn.gql.js',
    [`@magento/peregrine/lib/talons/WishlistPage/wishlistItemFragments.gql.js`]: './src/talons/WishlistPage/wishlistItemFragments.gql.js',

    //CSS
    [`@magento/venia-ui/lib/RootComponents/Category/category.module.css`]: './src/RootComponents/Category/category.module.css',
    [`@magento/venia-ui/lib/components/AccountInformationPage/accountInformationPage.module.css`]: './src/components/AccountInformationPage/accountInformationPage.module.css',
    [`@magento/venia-ui/lib/components/AddToCartDialog/addToCartDialog.module.css`]: './src/components/AddToCartDialog/addToCartDialog.module.css',
    [`@magento/venia-ui/lib/components/AddressBookPage/addressBookPage.module.css`]: './src/components/AddressBookPage/addressBookPage.module.css',
    [`@magento/venia-ui/lib/components/AddressBookPage/addressCard.module.css`]: './src/components/AddressBookPage/addressCard.module.css',
    [`@magento/venia-ui/lib/components/Button/button.module.css`]: './src/components/Button/button.module.css',
    [`@magento/venia-ui/lib/components/CartPage/PriceSummary/priceSummary.module.css`]: './src/components/CartPage/PriceSummary/priceSummary.module.css',
    [`@magento/venia-ui/lib/components/CartPage/cartPage.module.css`]: './src/components/CartPage/cartPage.module.css',
    [`@magento/venia-ui/lib/components/Checkbox/checkbox.module.css`]: './src/components/Checkbox/checkbox.module.css',
    [`@magento/venia-ui/lib/components/CheckoutPage/AddressBook/addressBook.module.css`]: './src/components/CheckoutPage/AddressBook/addressBook.module.css',
    [`@magento/venia-ui/lib/components/CheckoutPage/AddressBook/addressCard.module.css`]: './src/components/CheckoutPage/AddressBook/addressCard.module.css',
    [`@magento/venia-ui/lib/components/CheckoutPage/ShippingInformation/AddressForm/customerForm.module.css`]: './src/components/CheckoutPage/ShippingInformation/AddressForm/customerForm.module.css',
    [`@magento/venia-ui/lib/components/CheckoutPage/ShippingInformation/shippingInformation.module.css`]: './src/components/CheckoutPage/ShippingInformation/shippingInformation.module.css',
    [`@magento/venia-ui/lib/components/CheckoutPage/ShippingMethod/completedView.module.css`]: './src/components/CheckoutPage/ShippingMethod/completedView.module.css',
    [`@magento/venia-ui/lib/components/CheckoutPage/checkoutPage.module.css`]: './src/components/CheckoutPage/checkoutPage.module.css',
    [`@magento/venia-ui/lib/components/CommunicationsPage/communicationsPage.module.css`]: './src/components/CommunicationsPage/communicationsPage.module.css',
    [`@magento/venia-ui/lib/components/Dialog/dialog.module.css`]: './src/components/Dialog/dialog.module.css',
    [`@magento/venia-ui/lib/components/Field/field.module.css`]: './src/components/Field/field.module.css',
    [`@magento/venia-ui/lib/components/Field/message.module.css`]: './src/components/Field/message.module.css',
    [`@magento/venia-ui/lib/components/Footer/footer.module.css`]: './src/components/Footer/footer.module.css',
    [`@magento/venia-ui/lib/components/Gallery/addToCartButton.module.css`]: './src/components/Gallery/addToCartButton.module.css',
    [`@magento/venia-ui/lib/components/Gallery/item.module.css`]: './src/components/Gallery/item.module.css',
    [`@magento/venia-ui/lib/components/Header/accountTrigger.module.css`]: './src/components/Header/accountTrigger.module.css',
    [`@magento/venia-ui/lib/components/Header/cartTrigger.module.css`]: './src/components/Header/cartTrigger.module.css',
    [`@magento/venia-ui/lib/components/Header/header.module.css`]: './src/components/Header/header.module.css',
    [`@magento/venia-ui/lib/components/LinkButton/linkButton.module.css`]: './src/components/LinkButton/linkButton.module.css',
    [`@magento/venia-ui/lib/components/MiniCart/miniCart.module.css`]: './src/components/MiniCart/miniCart.module.css',
    [`@magento/venia-ui/lib/components/Newsletter/newsletter.module.css`]: './src/components/Newsletter/newsletter.module.css',
    [`@magento/venia-ui/lib/components/OrderHistoryPage/orderHistoryPage.module.css`]: './src/components/OrderHistoryPage/orderHistoryPage.module.css',
    [`@magento/venia-ui/lib/components/OrderHistoryPage/orderProgressBar.module.css`]: './src/components/OrderHistoryPage/orderProgressBar.module.css',
    [`@magento/venia-ui/lib/components/OrderHistoryPage/orderRow.module.css`]: './src/components/OrderHistoryPage/orderRow.module.css',
    [`@magento/venia-ui/lib/components/PageLoadingIndicator/pageLoadingIndicator.module.css`]: './src/components/PageLoadingIndicator/pageLoadingIndicator.module.css',
    [`@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.module.css`]: './src/components/ProductFullDetail/productFullDetail.module.css',
    [`@magento/venia-ui/lib/components/ProductOptions/tile.module.css`]: './src/components/ProductOptions/tile.module.css',
    [`@magento/venia-ui/lib/components/ProductOptions/tileList.module.css`]: './src/components/ProductOptions/tileList.module.css',
    [`@magento/venia-ui/lib/components/RadioGroup/radio.module.css`]: './src/components/RadioGroup/radio.module.css',
    [`@magento/venia-ui/lib/components/SavedPaymentsPage/savedPaymentsPage.module.css`]: './src/components/SavedPaymentsPage/savedPaymentsPage.module.css',
    [`@magento/venia-ui/lib/components/SearchPage/searchPage.module.css`]: './src/components/SearchPage/searchPage.module.css',
    [`@magento/venia-ui/lib/components/Select/select.module.css`]: './src/components/Select/select.module.css',
    [`@magento/venia-ui/lib/components/TextArea/textArea.module.css`]: './src/components/TextArea/textArea.module.css',
    [`@magento/venia-ui/lib/components/TextInput/textInput.module.css`]: './src/components/TextInput/textInput.module.css',
    [`@magento/venia-ui/lib/components/WishlistPage/wishlistItem.module.css`]: './src/components/WishlistPage/wishlistItem.module.css',
    [`@magento/venia-ui/lib/components/WishlistPage/wishlistPage.module.css`]: './src/components/WishlistPage/wishlistPage.module.css',
    [`@magento/venia-ui/lib/index.module.css`]: './src/css/index.module.css',
    [`@magento/venia-ui/lib/tokens.module.css`]: './src/css/tokens.module.css',
    [`@orienteed/customComponents/css/forms.module.css`]: './src/css/forms.module.css', // replace directly
    [`@orienteed/reorder/components/ReOrderBtn/reOrderBtn.module.css`]: './src/components/ReOrderBtn/reOrderBtn.module.css', // replace directly

    //new overwrite
    [`@magento/venia-ui/lib/components/ForgotPassword/ForgotPasswordForm/forgotPasswordForm.module.css`]: './src/components/ForgotPassword/ForgotPasswordForm/forgotPasswordForm.module.css',
    [`@magento/venia-ui/lib/components/CreateAccount/createAccount.module.css`]: './src/components/CreateAccount/createAccount.module.css',
    [`@magento/venia-ui/lib/components/CreateAccountPage/createAccountPage.module.css`]: './src/components/CreateAccountPage/createAccountPage.module.css',
    //new overwrite
    [`@magento/peregrine/lib/talons/Newsletter/useNewsletter.js`]: './src/talons/Newsletter/useNewsletter.js',

    //new overwrite
    [`@magento/venia-ui/lib/components/Gallery/gallery.module.css`]: './src/components/Gallery/gallery.module.css', // replace directly

    [`@magento/peregrine/lib/talons/Gallery/useAddToCartButton.js`]: './src/talons/Gallery/useAddToCartButton.js',
    [`@magento/venia-ui/lib/components/Gallery/addToCartButton.js`]: './src/components/Gallery/addToCartButton.js',

    //New overwrite
    [`@magento/venia-ui/lib/components/LegacyMiniCart/section.module.css`]: './src/components/LegacyMiniCart/section.module.css',
    [`@magento/venia-ui/lib/components/CartPage/ProductListing/product.module.css`]: './src/components/CartPage/ProductListing/product.module.css',

    //new overwrite
    [`@magento/peregrine/lib/talons/CheckoutPage/useCheckoutPage.js`]: './src/talons/CheckoutPage/useCheckoutPage.js'
};
