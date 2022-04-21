import { gql } from '@apollo/client';

import { CartTriggerFragment } from '@magento/peregrine/lib/talons/Header/cartTriggerFragments.gql';
import { MiniCartFragment } from '@magento/peregrine/lib/talons/MiniCart/miniCartFragments.gql';

import { WishlistPageFragment } from '@magento/peregrine/lib/talons/WishlistPage/wishlistFragment.gql.js';
import { WishlistItemFragment } from '@magento/peregrine/lib/talons/WishlistPage/wishlistItemFragments.gql';

export const ADD_PRODUCT_TO_CART = gql`
    mutation AddProductToCart($cartId: String!, $product: CartItemInput!) {
        addProductsToCart(cartId: $cartId, cartItems: [$product]) {
            cart {
                id
                ...CartTriggerFragment
                ...MiniCartFragment
            }
        }
    }
    ${CartTriggerFragment}
    ${MiniCartFragment}
`;

export const GET_WISHLIST_CONFIG = gql`
    query GetWishlistConfigForProductCE {
        storeConfig {
            id
            magento_wishlist_general_is_enabled
        }
    }
`;

/**
 * @deprecated - replaced by general mutation in @magento/peregrine/lib/talons/productFullDetail.js
 */
export const ADD_CONFIGURABLE_MUTATION = gql`
    mutation addConfigurableProductToCart(
        $cartId: String!
        $quantity: Float!
        $sku: String!
        $parentSku: String!
    ) {
        addConfigurableProductsToCart(
            input: {
                cart_id: $cartId
                cart_items: [
                    {
                        data: { quantity: $quantity, sku: $sku }
                        parent_sku: $parentSku
                    }
                ]
            }
        ) @connection(key: "addConfigurableProductsToCart") {
            cart {
                id
                # Update the cart trigger when adding an item.
                ...CartTriggerFragment
                # Update the mini cart when adding an item.
                ...MiniCartFragment
            }
        }
    }
    ${CartTriggerFragment}
    ${MiniCartFragment}
`;


export const GET_PRODUCTS_IN_WISHLISTS = gql`
    query GetProductsInWishlistsForGallery {
        customerWishlistProducts @client
    }
`;

/**
 * @deprecated - replaced by general mutation in @magento/peregrine/lib/talons/productFullDetail.js
 */
export const ADD_SIMPLE_MUTATION = gql`
    mutation addSimpleProductToCart(
        $cartId: String!
        $quantity: Float!
        $sku: String!
    ) {
        addSimpleProductsToCart(
            input: {
                cart_id: $cartId
                cart_items: [{ data: { quantity: $quantity, sku: $sku } }]
            }
        ) @connection(key: "addSimpleProductsToCart") {
            cart {
                id
                # Update the cart trigger when adding an item.
                ...CartTriggerFragment
                # Update the mini cart when adding an item.
                ...MiniCartFragment
            }
        }
    }
    ${CartTriggerFragment}
    ${MiniCartFragment}
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
    addConfigurableProductToCartMutation: ADD_CONFIGURABLE_MUTATION,
    addProductToCartMutation: ADD_PRODUCT_TO_CART,
    addSimpleProductToCartMutation: ADD_SIMPLE_MUTATION,
    getWishlistConfigQuery: GET_WISHLIST_CONFIG,
    getProductsInWishlistsQuery: GET_PRODUCTS_IN_WISHLISTS,
    getCustomerWishList: GET_CUSTOMER_WISHLIST,
    getCustomerWishlistItems: GET_CUSTOMER_WISHLIST_ITEMS,
};
