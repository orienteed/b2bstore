module.exports = [
    {
        name: 'AccountInformationPage',
        pattern: '/account-information',
        exact: true,
        path: '../AccountInformationPage',
        authed: true,
        redirectTo: '/sign-in'
    },
    {
        name: 'AddressBook',
        pattern: '/address-book',
        exact: true,
        path: '../AddressBookPage',
        authed: true,
        redirectTo: '/sign-in'
    },
    {
        name: 'Cart',
        pattern: '/cart',
        exact: true,
        path: '../CartPage'
    },
    {
        name: 'CheckoutPage',
        pattern: '/checkout',
        exact: true,
        path: '../CheckoutPage'
    },
    {
        name: 'CommunicationsPage',
        pattern: '/communications',
        exact: true,
        path: '../CommunicationsPage',
        authed: true,
        redirectTo: '/sign-in'
    },
    {
        name: 'ContactPage',
        pattern: '/contact-us',
        exact: true,
        path: '../ContactPage'
    },
    {
        name: 'CreateAccountPage',
        pattern: '/create-account',
        exact: true,
        path: '../CreateAccountPage'
    },
    {
        name: 'ForgotPasswordPage',
        pattern: '/forgot-password',
        exact: true,
        path: '../ForgotPasswordPage'
    },
    {
        name: 'OrderHistory',
        pattern: '/order-history',
        exact: true,
        path: '../OrderHistoryPage',
        authed: true,
        redirectTo: '/sign-in'
    },
    {
        name: 'Reset Password',
        pattern: '/customer/account/createPassword',
        exact: true,
        path: '../MyAccount/ResetPassword'
    },
    {
        name: 'SavedPayments',
        pattern: '/saved-payments',
        exact: true,
        path: '../SavedPaymentsPage',
        authed: true,
        redirectTo: '/sign-in'
    },
    {
        name: 'Search',
        pattern: '/search.html',
        exact: true,
        path: '../../RootComponents/Search'
    },
    {
        name: 'SignInPage',
        pattern: '/sign-in',
        exact: true,
        path: '../SignInPage'
    },
    {
        name: 'WishlistPage',
        pattern: '/wishlist',
        exact: true,
        path: '../WishlistPage',
        authed: true,
        redirectTo: '/sign-in'
    },
    {
        name: 'Courses',
        pattern: '/learning',
        exact: true,
        path: '../Lms/LearningRoute',
        authed: true,
        redirectTo: '/sign-in',
        isEnabled: process.env.LMS_INVENTADO
    },
    {
        name: 'Course',
        pattern: '/course',
        exact: true,
        path: '../Lms/LearningRoute',
        authed: true,
        redirectTo: '/sign-in',
        isEnabled: process.env.LMS_ENABLED
    },
    {
        name: 'Support',
        pattern: '/support',
        exact: true,
        path: '../Csr/SupportPage',
        authed: true,
        redirectTo: '/sign-in',
        isEnabled: process.env.CSR_ENABLED
    },
    {
        name: 'AdminPwaLogin',
        pattern: '/pwa/sign-in/:customer_token',
        path: '../AdminPwaLogin'
    }
];
