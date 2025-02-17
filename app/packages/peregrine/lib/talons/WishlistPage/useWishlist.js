import { useCallback, useEffect, useState } from 'react';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

/**
 * @function
 * @param {String} props.wishlistId The ID of the wishlist this item belongs to
 * @para  {itemsCount} props.itemsCount The items count fo the list.
 * @param {Boolean} props.isCollapsed state of is visable
 * @returns {WishListProps}
 */
export const useWishlist = (props = {}) => {
    const { id, itemsCount, isCollapsed } = props;

    const { getWishlistProducts } = useAdapter();

    const [page, setPage] = useState(1);
    const [isOpen, setIsOpen] = useState(!isCollapsed);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const { fetchWishlistItems, queryResult } = getWishlistProducts({ id: id, currentPage: 1 });
    const { data, error, loading, fetchMore } = queryResult;

    const handleContentToggle = () => {
        setIsOpen(currentValue => !currentValue);
    };

    const handleLoadMore = useCallback(async () => {
        setIsFetchingMore(true);
        const currentPage = page + 1;
        await fetchMore({
            variables: {
                id,
                currentPage
            }
        });

        setPage(currentPage);
        setIsFetchingMore(false);
    }, [id, fetchMore, page]);

    useEffect(() => {
        setPage(1);
        if (itemsCount >= 1 && isOpen === true && !data) {
            fetchWishlistItems();
        }
    }, [itemsCount, isOpen, fetchWishlistItems, data]);

    const items = data && data.customer.wishlist_v2.items_v2.items ? data.customer.wishlist_v2.items_v2.items : [];
    let csvItems;
    if (items.length > 0) {
        csvItems = items.map(item => {
            return {
                id: item.product.id,
                name: item.product.name,
                sku: item.product.sku,
                stockStatus: item.product.stock_status,
                regularPrice: item.product.price.regularPrice.amount.value,
                discountPrice: item.product.price.minimalPrice.amount.value,
                description: item.product.description.html,
            };
        });
    } else {
        csvItems = [];
    }
    return {
        handleContentToggle,
        isOpen,
        items,
        error,
        isLoading: !!loading,
        isFetchingMore,
        handleLoadMore,
        csvItems
    };
};

/**
 * JSDoc type definitions
 */

/**
 * Props data to use when rendering the Wishlist component.
 *
 * @typedef {Object} WishListProps
 *
 * @property {Function} handleContentToggle Callback to handle list expand toggle
 * @property {Boolean} isOpen Boolean which represents if the content is expanded or not
 * @property {Array} items list of items
 * @property {Boolean} isLoading Boolean which represents if is in loading state
 * @property {Boolean} isFetchingMore Boolean which represents if is in loading more state
 * @property {Function} handleLoadMore Callback to load more items
 */
