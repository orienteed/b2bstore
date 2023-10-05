import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';
import { useEffect } from 'react';

export const useStoreConfig = () => {
    const { getStoreConfig } = useAdapter();
    const { data, refetch } = getStoreConfig();

    useEffect(() => {
        console.log('STORE CONFIG DATA: ', data);
    }, [data]);

    return {
        data,
        refetch
    };
};
