import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useUserContext } from '../../context/user';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

import mergeOperations from '../../util/shallowMerge';
import DEFAULT_OPERATIONS from './customerWishlist.gql';

/**
 * A hook that queries for products in a customer's wishlists and maintains a
 * list of skus in a local cache entry.
 *
 * @param {DocumentNode} props.operations operations used to prepare the local customer wishlist array
 * @returns {undefined}
 */
export const useCustomerWishlistSkus = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getWishlistProductsForLocalFieldQuery } = operations;
    const { getProductsInWishlists, getWishlistProductsForLocalField } = useAdapter();

    const [{ isSignedIn }] = useUserContext();

    const [currentPage, setCurrentPage] = useState(1);

    const {
        client,
        data: { customerWishlistProducts },
        getProductsInWishlistsQuery
    } = getProductsInWishlists();

    useQuery(getWishlistProductsForLocalFieldQuery, {
        fetchPolicy: 'cache-and-network',
        onCompleted: data => {
            const itemsToAdd = new Set();
            const wishlists = data.customer.wishlists;
            let shouldFetchMore = false;
            wishlists.map(wishlist => {
                const items = wishlist.items_v2.items;
                items.map(item => {
                    const sku = item.product.sku;
                    if (!customerWishlistProducts.includes(sku)) {
                        itemsToAdd.add(sku);
                    }
                });

                const pageInfo = wishlist.items_v2.page_info;

                if (pageInfo.total_pages > pageInfo.current_page) {
                    shouldFetchMore = true;
                }
            });

            if (itemsToAdd.size) {
                client.writeQuery({
                    query: getProductsInWishlistsQuery,
                    data: {
                        customerWishlistProducts: [...customerWishlistProducts, ...itemsToAdd]
                    }
                });
            }

            if (shouldFetchMore) {
                setCurrentPage(current => ++current);
            }
        },
        skip: !isSignedIn,
        variables: {
            currentPage
        }
    });
};
