import { gql } from '@apollo/client';

import { WishlistItemFragment } from './wishlistItemFragments.gql';
import { WishlistPageFragment } from './wishlistFragment.gql.ce';

export const GET_PRODUCTS_IN_WISHLISTS = gql`
    query GetProductsInWishlists {
        customerWishlistProducts @client
    }
`;

export const GET_WISHLIST_PRODUCTS = gql`
    query GetWishlistProducts($id: ID!, $currentPage: Int) {
        customer {
            wishlist_v2(id: $id) {
                id
                items_v2(currentPage: $currentPage) {
                    items {
                        id
                        ...WishlistItemFragment
                    }
                }
            }
        }
    }
    ${WishlistItemFragment}
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
    getWishlistProductsQuery: GET_WISHLIST_PRODUCTS,
    removeProductsFromWishlistMutation: REMOVE_PRODUCTS_FROM_WISHLIST,
    updateWishlistMutation: UPDATE_WISHLIST
};
