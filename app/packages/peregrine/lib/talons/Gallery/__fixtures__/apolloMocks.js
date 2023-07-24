import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

// eslint-disable-next-line react-hooks/rules-of-hooks
const { getStoreConfig } = useAdapter();
const { getStoreConfigCEQuery, getStoreConfigEEQuery } = getStoreConfig();

export const mockGetStoreConfigAC = {
    request: {
        query: getStoreConfigEEQuery
    },
    result: {
        data: {
            storeConfig: {
                store_code: 'default',
                magento_wishlist_general_is_enabled: '1',
                enable_multiple_wishlists: '1',
                product_url_suffix: '.html'
            }
        }
    }
};

export const mockGetStoreConfigMOS = {
    request: {
        query: getStoreConfigCEQuery
    },
    result: {
        data: {
            storeConfig: {
                store_code: 'default',
                magento_wishlist_general_is_enabled: '1',
                product_url_suffix: '.html'
            }
        }
    }
};
