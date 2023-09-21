import { useCallback, useMemo, useState } from 'react';

import { useUserContext } from '../../../context/user';
import { useCartContext } from '../../../context/cart';
import { useGoogleReCaptcha } from '../../../hooks/useGoogleReCaptcha';
import { useEventingContext } from '../../../context/eventing';
import { useModulesContext } from '../../../context/modulesProvider';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

/**
 * Returns props necessary to render CreateAccount component. In particular this
 * talon handles the submission flow by first doing a pre-submisson validation
 * and then, on success, invokes the `onSubmit` prop, which is usually the action.
 *
 * This talon is almost identical to the other useCreateAccount but does not
 * return `isSignedIn`.
 *
 * @param {Object} props.initialValues initial values to sanitize and seed the form
 * @param {Function} props.onSubmit the post submit callback
 * @param {Object} props.operations GraphQL operations use by talon
 * @returns {{
 *   errors: Map,
 *   handleSubmit: function,
 *   isDisabled: boolean,
 *   initialValues: object,
 *   recaptchaWidgetProps: { containerElement: function, shouldRender: boolean }
 * }}
 */
export const useCreateAccount = props => {
    const { initialValues = {}, onSubmit } = props;

    const { tenantConfig } = useModulesContext();

    const {
        getCustomerInformation,
        createAccount: createAccountFromAdapter,
        signIn: signInFromAdapter,
        generateToken,
        getCartDetails: getCartDetailsFromAdapter,
        createCart: createCartFromAdapter
    } = useAdapter();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [, { createCart, getCartDetails, removeCart }] = useCartContext();
    const [{ isGettingDetails }, { getUserDetails, setToken }] = useUserContext();

    const [, { dispatch }] = useEventingContext();

    // For create account and sign in mutations, we don't want to cache any
    // personally identifiable information (PII). So we set fetchPolicy to 'no-cache'.
    // const [createAccount, { error: createAccountError }] = useMutation(createAccountMutation, {
    //     fetchPolicy: 'no-cache'
    // });

    // BIGCOMMERCE ADAPTER

    const { data: tokenData } = generateToken();

    const { signIn, error: signInError } = signInFromAdapter();

    const { createAccount, error: createAccountError } = createAccountFromAdapter();

    const fetchUserDetails = getCustomerInformation({ isAwait: true });

    const { fetchCartId } = createCartFromAdapter();

    const { fetchCartDetails } = getCartDetailsFromAdapter();

    // END

    const { generateReCaptchaData, recaptchaLoading, recaptchaWidgetProps } = useGoogleReCaptcha({
        currentForm: 'CUSTOMER_CREATE',
        formAction: 'createAccount'
    });

    const handleSubmit = useCallback(
        async formValues => {
            setIsSubmitting(true);
            try {
                // Get reCaptchaV3 Data for createAccount mutation
                const recaptchaDataForCreateAccount = await generateReCaptchaData();

                // Create the account and then sign in.
                await createAccount({
                    variables: {
                        email: formValues.customer.email,
                        firstname: formValues.customer.firstname,
                        lastname: formValues.customer.lastname,
                        password: formValues.password,
                        is_subscribed: !!formValues.subscribe,
                        channel_id: tenantConfig?.bigcommerceChannelId
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
                        password: formValues.password,
                        auth: tokenData.data.token
                    },
                    ...recaptchaDataForSignIn
                });
                const token = signInResponse.data.generateCustomerToken.token;
                await setToken(token);

                // Clear guest cart from redux.
                await removeCart();

                // Create a new customer cart.
                await createCart({
                    fetchCartId
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
            createAccount,
            createCart,
            fetchCartDetails,
            fetchCartId,
            fetchUserDetails,
            generateReCaptchaData,
            getCartDetails,
            getUserDetails,
            onSubmit,
            removeCart,
            setToken,
            signIn,
            dispatch
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
        handleSubmit,
        isDisabled: isSubmitting || isGettingDetails || recaptchaLoading,
        initialValues: sanitizedInitialValues,
        recaptchaWidgetProps
    };
};
