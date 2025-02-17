import { useState, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import { useGoogleReCaptcha } from '@magento/peregrine/lib/hooks/useGoogleReCaptcha';

import { useSignIn } from '../SignIn/useSignIn';
import modifyLmsCustomer from '@magento/peregrine/lib/RestApi/Lms/users/modifyCustomer';
import { useModulesContext } from '../../context/modulesProvider';

/**
 * Returns props necessary to render a ResetPassword form.
 *
 * @param {function} props.mutations - mutation to call when the user submits the new password.
 *
 * @returns {ResetPasswordProps} - GraphQL mutations for the reset password form.
 *
 * @example <caption>Importing into your project</caption>
 * import { useResetPassword } from '@magento/peregrine/lib/talons/MyAccount/useResetPassword.js';
 */
export const useResetPassword = props => {
    const { resetPasswordFromAdapter } = props;

    const { tenantConfig } = useModulesContext();

    const [hasCompleted, setHasCompleted] = useState(false);
    const location = useLocation();
    const { resetPassword, error: resetPasswordErrors, loading } = resetPasswordFromAdapter();

    const { recaptchaLoading, generateReCaptchaData, recaptchaWidgetProps } = useGoogleReCaptcha({
        currentForm: 'CUSTOMER_FORGOT_PASSWORD',
        formAction: 'resetPassword'
    });

    const { handleSubmit: handleSignIn } = useSignIn({
        setDefaultUsername: null
    });

    const searchParams = useMemo(() => new URLSearchParams(location.search), [location]);
    const token = searchParams.get('token');

    const handleSubmit = useCallback(
        async ({ email, newPassword }) => {
            try {
                if (email && token && newPassword) {
                    const reCaptchaData = await generateReCaptchaData();

                    await resetPassword({
                        variables: { email, token, newPassword },
                        ...reCaptchaData
                    });

                    await handleSignIn({ email, password: newPassword });

                    tenantConfig.lmsEnabled && modifyLmsCustomer('', '', email, newPassword);

                    setHasCompleted(true);
                }
            } catch (err) {
                // Error is logged by apollo link - no need to double log.
                setHasCompleted(false);
            }
        },
        [generateReCaptchaData, resetPassword, token, handleSignIn, tenantConfig]
    );

    return {
        formErrors: [resetPasswordErrors],
        handleSubmit,
        hasCompleted,
        loading: loading || recaptchaLoading,
        token,
        recaptchaWidgetProps
    };
};

/** JSDocs type definitions */

/**
 * GraphQL mutations for the reset password form.
 * This is a type used by the {@link useResetPassword} talon.
 *
 * @typedef {Object} ResetPasswordMutations
 *
 * @property {GraphQLAST} resetPasswordMutation mutation for resetting password
 *
 * @see [resetPassword.gql.js]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/MyAccount/ResetPassword/resetPassword.gql.js}
 * for the query used in Venia
 */

/**
 * Object type returned by the {@link useResetPassword} talon.
 * It provides props data to use when rendering the reset password form component.
 *
 * @typedef {Object} ResetPasswordProps
 *
 * @property {Array} formErrors A list of form errors
 * @property {Function} handleSubmit Callback function to handle form submission
 * @property {Boolean} hasCompleted True if password reset mutation has completed. False otherwise
 * @property {Boolean} loading True if form awaits events. False otherwise
 * @property {String} token token needed for password reset, will be sent in the mutation
 * @property {Object} recaptchaWidgetProps Props for the GoogleReCaptcha component
 */
