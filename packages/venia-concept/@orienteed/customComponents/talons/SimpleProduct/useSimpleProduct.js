import { useQuery } from '@apollo/client';

import { useCustomerWishlistSkus } from '@magento/peregrine/lib/hooks/useCustomerWishlistSkus/useCustomerWishlistSkus';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge.js';
import defaultOperations from '@magento/peregrine/lib/talons/Gallery/gallery.gql';

export const useSimpleProduct = (props = {}) => {
    const operations = mergeOperations(defaultOperations, props.operations);

    useCustomerWishlistSkus();

    const { data: storeConfigData } = useQuery(operations.getStoreConfigQuery, {
        fetchPolicy: 'cache-and-network'
    });

    const storeConfig = storeConfigData ? storeConfigData.storeConfig : null;

    return {
        storeConfig
    };
};
