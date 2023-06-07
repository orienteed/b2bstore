import { gql } from '@apollo/client';

import { WishlistPageFragment } from './wishlistFragment.gql.ce';

export const GET_PRODUCTS_IN_WISHLISTS = gql`
    query GetProductsInWishlists {
        customerWishlistProducts @client
    }
`;

export const REMOVE_PRODUCTS_FROM_WISHLIST = gql`
    mutation RemoveProductsFromWishlist($wishlistId: ID!, $wishlistItemsId: [ID!]!) {
        removeProductsFromWishlist(wishlistId: $wishlistId, wishlistItemsIds: $wishlistItemsId) {
            wishlist {
                id
                ...WishlistPageFragment
            }
        }
    }
    ${WishlistPageFragment}
`;

export const UPDATE_WISHLIST = gql`
    mutation UpdateWishlist($name: String!, $visibility: WishlistVisibilityEnum!, $wishlistId: ID!) {
        updateWishlist(name: $name, visibility: $visibility, wishlistId: $wishlistId) {
            name
            uid
            visibility
        }
    }
`;

export default {
    getProductsInWishlistsQuery: GET_PRODUCTS_IN_WISHLISTS,
    removeProductsFromWishlistMutation: REMOVE_PRODUCTS_FROM_WISHLIST,
    updateWishlistMutation: UPDATE_WISHLIST
};
