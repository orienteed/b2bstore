import { useCallback, useRef, useState, useMemo } from 'react';
import { useApolloClient } from '@apollo/client';

import { useGoogleReCaptcha } from '../../hooks/useGoogleReCaptcha/useGoogleReCaptcha';
import { useCartContext } from '../../context/cart';
import { useUserContext } from '../../context/user';
import { retrieveCartId } from '../../store/actions/cart';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

import { useEventingContext } from '../../context/eventing';

import doCsrLogin from '@magento/peregrine/lib/RestApi/Csr/auth/login.js';
import doLmsLogin from '@magento/peregrine/lib/RestApi/Lms/auth/login.js';

import { useModulesContext } from '../../context/modulesProvider';

export const useSignIn = props => {
    const { setDefaultUsername, showCreateAccount, showForgotPassword } = props;

    const {
        createCart: createCartFromAdapter,
        getCartDetails: getCartDetailsFromAdapter,
        mergeCarts: mergeCartsFromAdapter,
        signIn: signInFromAdapter,
        getCustomerInformation
    } = useAdapter();

    const apolloClient = useApolloClient();
    const [isSigningIn, setIsSigningIn] = useState(false);

    const { tenantConfig } = useModulesContext();

    const [{ cartId }, { createCart, removeCart, getCartDetails }] = useCartContext();

    const [{ isGettingDetails, getDetailsError }, { getUserDetails, setToken }] = useUserContext();

    const [, { dispatch }] = useEventingContext();

    const { signIn, error: signInError } = signInFromAdapter();

    const { generateReCaptchaData, recaptchaLoading, recaptchaWidgetProps } = useGoogleReCaptcha({
        currentForm: 'CUSTOMER_LOGIN',
        formAction: 'signIn'
    });

    const { fetchCartId } = createCartFromAdapter();
    const { fetchCartDetails } = getCartDetailsFromAdapter();

    const { mergeCarts } = mergeCartsFromAdapter();
    const fetchUserDetails = getCustomerInformation({ isAwait: true });

    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);

    const handleSubmit = useCallback(
        async ({ email, password }) => {
            setIsSigningIn(true);
            try {
                // Get source cart id (guest cart id).
                const sourceCartId = cartId;

                // Get recaptchaV3 data for login
                const recaptchaData = await generateReCaptchaData();

                // Sign in and set the token.
                const signInResponse = await signIn({
                    variables: {
                        email,
                        password
                    },
                    ...recaptchaData
                });
                const token = signInResponse.data.generateCustomerToken.token;
                await setToken(token);

                // LMS logic
                tenantConfig.lmsEnabled && doLmsLogin(password);

                // CSR logic
                tenantConfig.csrEnabled && doCsrLogin();

                // Clear all cart/customer data from cache and redux.
                await apolloClient.clearCacheData(apolloClient, 'cart');
                await apolloClient.clearCacheData(apolloClient, 'customer');
                await removeCart();

                // Create and get the customer's cart id.
                await createCart({
                    fetchCartId
                });
                const destinationCartId = await retrieveCartId();

                // Merge the guest cart into the customer cart.
                await mergeCarts({
                    variables: {
                        destinationCartId,
                        sourceCartId
                    }
                });

                // Ensure old stores are updated with any new data.

                await getUserDetails({ fetchUserDetails });

                const { data } = await fetchUserDetails({
                    fetchPolicy: 'cache-only'
                });

                dispatch({
                    type: 'USER_SIGN_IN',
                    payload: {
                        ...data.customer
                    }
                });

                getCartDetails({ fetchCartId, fetchCartDetails });
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }

                setIsSigningIn(false);
            }
        },
        [
            cartId,
            generateReCaptchaData,
            signIn,
            setToken,
            tenantConfig,
            apolloClient,
            removeCart,
            createCart,
            fetchCartId,
            mergeCarts,
            getUserDetails,
            fetchUserDetails,
            dispatch,
            getCartDetails,
            fetchCartDetails
        ]
    );

    const handleForgotPassword = useCallback(() => {
        const { current: formApi } = formApiRef;

        if (formApi) {
            setDefaultUsername(formApi.getValue('email'));
        }

        showForgotPassword();
    }, [setDefaultUsername, showForgotPassword]);

    const handleCreateAccount = useCallback(() => {
        const { current: formApi } = formApiRef;

        if (formApi) {
            setDefaultUsername(formApi.getValue('email'));
        }

        showCreateAccount();
    }, [setDefaultUsername, showCreateAccount]);

    const errors = useMemo(() => new Map([['getUserDetailsQuery', getDetailsError], ['signInMutation', signInError]]), [
        getDetailsError,
        signInError
    ]);

    return {
        errors,
        handleCreateAccount,
        handleForgotPassword,
        handleSubmit,
        isBusy: isGettingDetails || isSigningIn, // || recaptchaLoading,
        isSigningIn,
        recaptchaWidgetProps,
        setFormApi
    };
};
