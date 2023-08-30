import { useCallback, useMemo } from 'react';

import { useUserContext } from '../../context/user';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

export const useCommunicationsPage = props => {
    const { afterSubmit } = props;

    const { getCustomerSubscription, setNewsletterSubscription: setNewsletterSubscriptionFromAdapter } = useAdapter();

    const [{ isSignedIn }] = useUserContext();

    const { data: subscriptionData, error: subscriptionDataError } = getCustomerSubscription({ isSignedIn: isSignedIn });

    const initialValues = useMemo(() => {
        if (subscriptionData) {
            return { isSubscribed: subscriptionData.customer.is_subscribed };
        }
    }, [subscriptionData]);

    const {
        setNewsletterSubscription,
        error: setNewsletterSubscriptionError,
        loading: isSubmitting
    } = setNewsletterSubscriptionFromAdapter();

    const handleSubmit = useCallback(
        async formValues => {
            try {
                await setNewsletterSubscription({
                    variables: formValues
                });
            } catch {
                // we have an onError link that logs errors, and FormError already renders this error, so just return
                // to avoid triggering the success callback
                return;
            }
            if (afterSubmit) {
                afterSubmit();
            }
        },
        [setNewsletterSubscription, afterSubmit]
    );

    return {
        formErrors: [setNewsletterSubscriptionError, subscriptionDataError],
        initialValues,
        handleSubmit,
        isDisabled: isSubmitting
    };
};
