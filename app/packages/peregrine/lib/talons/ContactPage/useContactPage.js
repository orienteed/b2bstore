import { useCallback, useRef, useMemo } from 'react';
import { useStoreConfigContext } from '@magento/peregrine/lib/context/storeConfigProvider';

import { useAdapter } from '../../hooks/useAdapter';

export default props => {
    const { cmsBlockIdentifiers = [] } = props;

    const { getCmsBlocks, submitContactForm } = useAdapter();

    const formApiRef = useRef(null);

    const { submitForm, data, error: contactError, loading: submitLoading } = submitContactForm();

    const { data: storeConfigData } = useStoreConfigContext();

    const { data: cmsBlocksData, loading: cmsBlocksLoading } = getCmsBlocks({
        identifiers: cmsBlockIdentifiers
    });

    const isEnabled = useMemo(() => {
        return !!storeConfigData?.storeConfig?.contact_enabled;
    }, [storeConfigData]);

    const cmsBlocks = useMemo(() => {
        return cmsBlocksData?.cmsBlocks?.items || [];
    }, [cmsBlocksData]);

    const setFormApi = useCallback(api => (formApiRef.current = api), []);
    const handleSubmit = useCallback(
        async ({ name, email, comment, telephone }) => {
            try {
                await submitForm({
                    variables: {
                        name,
                        email,
                        comment,
                        telephone
                    }
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
        [submitForm]
    );
    const errors = useMemo(() => new Map([['submitContactFormMutation', contactError]]), [contactError]);

    return {
        isEnabled,
        cmsBlocks,
        errors,
        handleSubmit,
        isBusy: submitLoading,
        isLoading: storeConfigData === undefined && cmsBlocksLoading,
        setFormApi,
        response: data && data.contactUs
    };
};
