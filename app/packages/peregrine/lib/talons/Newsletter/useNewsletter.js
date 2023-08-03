import { useCallback, useRef, useMemo, useState } from 'react';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';
import { useStoreConfigContext } from '../../context/storeConfigProvider';

export const useNewsletter = () => {
    const { subscribeToNewsletter } = useAdapter();

    const formApiRef = useRef(null);

    const [newsLetterError, setNewsLetterError] = useState(null);

    const clearErrors = () => setNewsLetterError(null);

    const { subscribeNewsLetter, data, loading: subscribeLoading } = subscribeToNewsletter({ setNewsLetterError: setNewsLetterError });

    const { data: storeConfigData } = useStoreConfigContext();

    const isEnabled = useMemo(() => {
        return !!storeConfigData?.storeConfig?.newsletter_enabled;
    }, [storeConfigData]);

    const setFormApi = useCallback(api => (formApiRef.current = api), []);
    const handleSubmit = useCallback(
        async ({ email }) => {
            try {
                await subscribeNewsLetter({
                    variables: { email }
                });
                if (formApiRef.current) {
                    formApiRef.current.reset();
                }
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
            }
        },
        [subscribeNewsLetter]
    );
    const errors = useMemo(() => new Map([['subscribeToNewsletterMutation', newsLetterError]]), [newsLetterError]);

    return {
        isEnabled,
        errors,
        handleSubmit,
        isBusy: subscribeLoading,
        isLoading: storeConfigData === undefined,
        setFormApi,
        newsLetterResponse: data && data.subscribeEmailToNewsletter,
        clearErrors
    };
};
