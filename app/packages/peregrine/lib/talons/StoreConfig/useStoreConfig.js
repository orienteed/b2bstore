import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

export const useStoreConfig = () => {
    const { getStoreConfig } = useAdapter();
    const { data, refetch } = getStoreConfig();

    return {
        data,
        refetch
    };
};
