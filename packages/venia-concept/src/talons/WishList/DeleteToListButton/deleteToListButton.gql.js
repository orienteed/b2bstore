import { gql } from '@apollo/client';
import { WishlistPageFragment } from '@magento/peregrine/lib/talons/WishlistPage/wishlistFragment.gql.js';
import { WishlistItemFragment } from '@magento/peregrine/lib/talons/WishlistPage/wishlistItemFragments.gql';

export const REMOVE_PRODUCTS_FROM_WISHLIST = gql`
    mutation RemoveProductsFromWishlist(
        $wishlistId: ID!
        $wishlistItemsId: [ID!]!
    ) {
        removeProductsFromWishlist(
            wishlistId: $wishlistId
            wishlistItemsIds: $wishlistItemsId
        ) {
            wishlist {
                id
                ...WishlistPageFragment
            }
        }
    }
    ${WishlistPageFragment}
`;

export const GET_PRODUCTS_IN_WISHLISTS = gql`
    query GetProductsInWishlistsForGallery {
        customerWishlistProducts @client
    }
`;

export const GET_CUSTOMER_WISHLIST_ITEMS = gql`
    query getCustomerWishlist($id: ID!) {
        customer {
            id
            wishlist_v2(id: $id) {
                id
                items_v2 {
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

export const GET_CUSTOMER_WISHLIST = gql`
    query GetCustomerWishlist {
        customer {
            id
            wishlists {
                id
                ...WishlistPageFragment
            }
        }
    }
    ${WishlistPageFragment}
`;

export default {
    getCustomerWishList: GET_CUSTOMER_WISHLIST,
    getCustomerWishlistItems: GET_CUSTOMER_WISHLIST_ITEMS,
    removeProductToWishlistMutation: REMOVE_PRODUCTS_FROM_WISHLIST,
    getProductsInWishlistsQuery: GET_PRODUCTS_IN_WISHLISTS
};
