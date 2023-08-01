import { useCallback, useRef, useMemo } from 'react';
import { useMutation } from '@apollo/client';
import { useStoreConfigContext } from '@magento/peregrine/lib/context/storeConfigProvider';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './contactUs.gql';
import { useAdapter } from '../../hooks/useAdapter';

export default props => {
    const { cmsBlockIdentifiers = [] } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { submitContactFormMutation } = operations;

    const formApiRef = useRef(null);

    const [submitForm, { data, error: contactError, loading: submitLoading }] = useMutation(submitContactFormMutation, {
        fetchPolicy: 'no-cache'
    });

    const { data: storeConfigData } = useStoreConfigContext();

    const { getCmsBlocks } = useAdapter();
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
