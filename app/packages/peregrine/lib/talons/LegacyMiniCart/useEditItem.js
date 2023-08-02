import { useEffect } from 'react';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

export const useEditItem = props => {
    const { item } = props;

    const { getProductDetailForConfigurableOptionsBySku } = useAdapter();

    const { runQuery, queryResult } = getProductDetailForConfigurableOptionsBySku({ isLazy: true });
    const { data, error, loading } = queryResult;

    const itemHasOptions = item.configurable_options && item.configurable_options.length > 0;

    // Run the query once on mount and again whenever the
    // item being edited changes.
    useEffect(() => {
        // Only fetch item variants if it can have them.
        if (itemHasOptions) {
            runQuery({
                variables: {
                    sku: item.product.sku
                }
            });
        }
    }, [item, itemHasOptions, runQuery]);

    // If we don't have possible options for the item just use an empty object
    const configItem = data && data.products && data.products.items[0];

    return {
        configItem,
        hasError: !!error,
        isLoading: !!loading,
        itemHasOptions
    };
};
