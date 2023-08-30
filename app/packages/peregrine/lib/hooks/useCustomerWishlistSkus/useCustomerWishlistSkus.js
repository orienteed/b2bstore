import { useState } from 'react';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';
import { useUserContext } from '../../context/user';

/**
 * A hook that queries for products in a customer's wishlists and maintains a
 * list of skus in a local cache entry.
 *
 * @param {DocumentNode} props.operations operations used to prepare the local customer wishlist array
 * @returns {undefined}
 */
export const useCustomerWishlistSkus = () => {
    const { getProductsInWishlists, getWishlistProductsForLocalField } = useAdapter();

    const [{ isSignedIn }] = useUserContext();

    const [currentPage, setCurrentPage] = useState(1);

    const {
        client,
        data: { customerWishlistProducts }
    } = getProductsInWishlists();

    getWishlistProductsForLocalField(
        {
            currentPage: currentPage,
            client: client,
            customerWishlistProducts: customerWishlistProducts,
            isSignedIn: isSignedIn,
            setCurrentPage: setCurrentPage
        }
    );
};
