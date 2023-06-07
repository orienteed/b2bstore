import { useMemo } from 'react';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

/**
 * @function
 *
 * @returns {WishlistPageProps}
 */
export const useWishlistPage = () => {
    const { getWishlists } = useAdapter();

    const [{ isSignedIn }] = useUserContext();

    const { data, error, loading } = getWishlists({ hasIsSignedIn: true, isSignedIn: isSignedIn });

    const derivedWishlists = useMemo(() => {
        return (data && data.customer.wishlists) || [];
    }, [data]);

    const errors = useMemo(() => {
        return new Map([['getWishlistsQuery', error]]);
    }, [error]);

    return {
        errors,
        loading,
        shouldRenderVisibilityToggle: derivedWishlists.length > 1,
        wishlists: derivedWishlists
    };
};

/**
 * JSDoc type definitions
 */

/**
 * GraphQL mutations for the Wishlist Page
 *
 * @typedef {Object} WishlistQueries
 *
 * @property {GraphQLDocument} getWishlistsQuery Query to get customer wish lists
 *
 * @see [`wishlistPage.gql.js`]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/WishlistPage/wishlistPage.gql.js}
 * for queries used in Venia
 */

/**
 * GraphQL types for the Wishlist Page
 *
 * @typedef {Object} WishlistTypes
 *
 * @property {Function} Customer.fields.wishlists.read
 *
 * @see [`wishlistPage.gql.js`]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/WishlistPage/wishlistPage.gql.js}
 * for queries used in Venia
 */

/**
 * Props data to use when rendering the Wishlist Item component
 *
 * @typedef {Object} WishlistPageProps
 *
 * @property {Map} errors A map of all the GQL query errors
 * @property {Boolean} loading is the query loading
 * @property {Boolean} shouldRenderVisibilityToggle true if wishlists length is > 1.
 * @property {Object} wishlists List of all customer wishlists
 */
