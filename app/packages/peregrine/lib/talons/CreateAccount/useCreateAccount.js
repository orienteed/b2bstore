import { useCallback, useMemo, useState } from 'react';
import { useApolloClient } from '@apollo/client';

import { useUserContext } from '../../context/user';
import { useCartContext } from '../../context/cart';
import { retrieveCartId } from '../../store/actions/cart';
import { useGoogleReCaptcha } from '../../hooks/useGoogleReCaptcha';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

import { useEventingContext } from '../../context/eventing';

import doCsrLogin from '@magento/peregrine/lib/RestApi/Csr/auth/login';
import doLmsLogin from '@magento/peregrine/lib/RestApi/Lms/auth/login';

import { useModulesContext } from '../../context/modulesProvider';

/**
 * Returns props necessary to render CreateAccount component. In particular this
 * talon handles the submission flow by first doing a pre-submisson validation
 * and then, on success, invokes the `onSubmit` prop, which is usually the action.
 *
 * @param {CreateAccountQueries} props.queries queries used by the talon
 * @param {CreateAccountMutations} props.mutations mutations used by the talon
 * @param {InitialValues} props.initialValues initial values to sanitize and seed the form
 * @param {Function} props.onSubmit the post submit callback
 * @param {Function} props.onCancel the cancel callback
 *
 * @returns {CreateAccountProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useForgotPassword } from '@magento/peregrine/lib/talons/CreateAccount/useCreateAccount.js';
 */
export const useCreateAccount = props => {
    const { initialValues = {}, onSubmit, onCancel } = props;

    const {
        createCart: createCartFromAdapter,
        getCartDetails: getCartDetailsFromAdapter,
        mergeCarts: mergeCartsFromAdapter,
        signIn: signInFromAdapter,
        createAccount: createAccountFromAdapter,
        getCustomerInformation
    } = useAdapter();

    const apolloClient = useApolloClient();

    const { tenantConfig } = useModulesContext();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [{ cartId }, { createCart, removeCart, getCartDetails }] = useCartContext();
    const [{ isGettingDetails }, { getUserDetails, setToken }] = useUserContext();

    const [, { dispatch }] = useEventingContext();

    const { fetchCartId } = createCartFromAdapter();
    const { fetchCartDetails } = getCartDetailsFromAdapter();

    const { mergeCarts } = mergeCartsFromAdapter();

    // For create account and sign in mutations, we don't want to cache any
    // personally identifiable information (PII). So we set fetchPolicy to 'no-cache'.
    const { createAccount, error: createAccountError } = createAccountFromAdapter();

    const { signIn, error: signInError } = signInFromAdapter();

    const fetchUserDetails = getCustomerInformation({ isAwait: true });

    const { generateReCaptchaData, recaptchaLoading, recaptchaWidgetProps } = useGoogleReCaptcha({
        currentForm: 'CUSTOMER_CREATE',
        formAction: 'createAccount'
    });

    const handleCancel = useCallback(() => {
        onCancel();
    }, [onCancel]);

    const handleSubmit = useCallback(
        async formValues => {
            setIsSubmitting(true);
            try {
                // Get source cart id (guest cart id).
                const sourceCartId = cartId;

                // Get reCaptchaV3 Data for createAccount mutation
                const recaptchaDataForCreateAccount = await generateReCaptchaData();

                // Create the account and then sign in.
                await createAccount({
                    variables: {
                        email: formValues.customer.email,
                        firstname: formValues.customer.firstname,
                        lastname: formValues.customer.lastname,
                        password: formValues.password,
                        is_subscribed: !!formValues.subscribe
                    },
                    ...recaptchaDataForCreateAccount
                });

                dispatch({
                    type: 'USER_CREATE_ACCOUNT',
                    payload: {
                        email: formValues.customer.email,
                        firstName: formValues.customer.firstname,
                        lastName: formValues.customer.lastname,
                        isSubscribed: !!formValues.subscribe
                    }
                });

                // Get reCaptchaV3 Data for signIn mutation
                const recaptchaDataForSignIn = await generateReCaptchaData();

                const signInResponse = await signIn({
                    variables: {
                        email: formValues.customer.email,
                        password: formValues.password
                    },
                    ...recaptchaDataForSignIn
                });
                const token = signInResponse.data.generateCustomerToken.token;
                await setToken(token);

                // LMS logic
                tenantConfig.lmsEnabled && doLmsLogin(formValues.password);

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
                await getCartDetails({
                    fetchCartId,
                    fetchCartDetails
                });

                // Finally, invoke the post-submission callback.
                if (onSubmit) {
                    onSubmit();
                }
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
                setIsSubmitting(false);
            }
        },
        [
            apolloClient,
            cartId,
            createAccount,
            createCart,
            dispatch,
            tenantConfig,
            fetchCartDetails,
            fetchCartId,
            fetchUserDetails,
            generateReCaptchaData,
            getCartDetails,
            getUserDetails,
            mergeCarts,
            onSubmit,
            removeCart,
            setToken,
            signIn
        ]
    );

    const sanitizedInitialValues = useMemo(() => {
        const { email, firstName, lastName, ...rest } = initialValues;

        return {
            customer: { email, firstname: firstName, lastname: lastName },
            ...rest
        };
    }, [initialValues]);

    const errors = useMemo(
        () => new Map([['createAccountQuery', createAccountError], ['signInMutation', signInError]]),
        [createAccountError, signInError]
    );

    return {
        errors,
        handleCancel,
        handleSubmit,
        initialValues: sanitizedInitialValues,
        isDisabled: isSubmitting || isGettingDetails || recaptchaLoading,
        recaptchaWidgetProps
    };
};

/** JSDocs type definitions */

/**
 * GraphQL queries for the create account form.
 * This is a type used by the {@link useCreateAccount} talon.
 *
 * @typedef {Object} CreateAccountQueries
 *
 * @property {GraphQLAST} customerQuery query to fetch customer details
 * @property {GraphQLAST} getCartDetailsQuery query to get cart details
 */

/**
 * GraphQL mutations for the create account form.
 * This is a type used by the {@link useCreateAccount} talon.
 *
 * @typedef {Object} CreateAccountMutations
 *
 * @property {GraphQLAST} createAccountMutation mutation for creating new account
 * @property {GraphQLAST} createCartMutation mutation for creating new cart
 * @property {GraphQLAST} mergeCartsMutation mutation for merging carts
 * @property {GraphQLAST} signInMutation mutation for signing
 */

/**
 * Initial values for the create account form.
 * This is a type used by the {@link useCreateAccount} talon.
 *
 * @typedef {Object} InitialValues
 *
 * @property {String} email email id of the user
 * @property {String} firstName first name of the user
 * @property {String} lastName last name of the user
 */

/**
 * Sanitized initial values for the create account form.
 * This is a type used by the {@link useCreateAccount} talon.
 *
 * @typedef {Object} SanitizedInitialValues
 *
 * @property {String} email email id of the user
 * @property {String} firstname first name of the user
 * @property {String} lastname last name of the user
 */

/**
 * Object type returned by the {@link useCreateAccount} talon.
 * It provides props data to use when rendering the create account form component.
 *
 * @typedef {Object} CreateAccountProps
 *
 * @property {Map} errors a map of errors to their respective mutations
 * @property {Function} handleCancel callback function to handle form cancellations
 * @property {Function} handleSubmit callback function to handle form submission
 * @property {SanitizedInitialValues} initialValues initial values for the create account form
 * @property {Boolean} isDisabled true if either details are being fetched or form is being submitted. False otherwise.
 * @property {Object} recaptchaWidgetProps - Props for the GoogleReCaptcha component.
 * @property {Function} recaptchaWidgetProps.containerElement - Container reference callback.
 * @property {Boolean} recaptchaWidgetProps.shouldRender - Checks if component should be rendered.
 */
