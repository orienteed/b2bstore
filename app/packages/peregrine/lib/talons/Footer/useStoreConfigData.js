import { useStoreConfigContext } from '@magento/peregrine/lib/context/storeConfigProvider';

export const useStoreConfigData = () => {
    const storeConfigData = useStoreConfigContext();

    return {
        storeConfigData
    };
};
