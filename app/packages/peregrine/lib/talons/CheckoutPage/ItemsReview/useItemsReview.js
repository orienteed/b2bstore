import { useEffect, useState, useCallback, useMemo } from 'react';

import { useCartContext } from '../../../context/cart';
import { useStoreConfigContext } from '../../../context/storeConfigProvider';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

export const useItemsReview = props => {
    const [showAllItems, setShowAllItems] = useState(false);

    const { getItemsInCart } = useAdapter();
    const { fetchItemsInCart, data: queryData, error, loading } = getItemsInCart();

    const [{ cartId }] = useCartContext();

    const { data: storeConfigData } = useStoreConfigContext();

    const configurableThumbnailSource = useMemo(() => {
        if (storeConfigData) {
            return storeConfigData.storeConfig.configurable_thumbnail_source;
        }
    }, [storeConfigData]);

    // If static data was provided, use that instead of query data.
    const data = props.data || queryData;

    const setShowAllItemsFlag = useCallback(() => setShowAllItems(true), [setShowAllItems]);

    useEffect(() => {
        if (cartId && !props.data) {
            fetchItemsInCart({
                variables: {
                    cartId
                }
            });
        }
    }, [cartId, fetchItemsInCart, props.data]);

    useEffect(() => {
        /**
         * If there are 2 or less than 2 items in cart
         * set show all items to `true`.
         */
        if (data && data.cart && data.cart.items.length <= 2) {
            setShowAllItems(true);
        }
    }, [data]);

    const items = data ? data.cart.items : [];

    const totalQuantity = data ? +data.cart.total_quantity : 0;

    return {
        isLoading: !!loading,
        items,
        hasErrors: !!error,
        totalQuantity,
        showAllItems,
        setShowAllItems: setShowAllItemsFlag,
        configurableThumbnailSource
    };
};
