import { gql } from '@apollo/client';

import { AvailableShippingMethodsCartFragment } from './PriceAdjustments/ShippingMethods/shippingMethodsFragments.gql.js';
import { CartPageFragment } from './cartPageFragments.gql';
import { CheckoutPageFragment } from '../CheckoutPage/checkoutPageFragments.gql';
import { MiniCartFragment } from '../MiniCart/miniCartFragments.gql';

export const MERGE_CARTS = gql`
    mutation MergeCarts($sourceCartId: String!, $destinationCartId: String!) {
        mergeCarts(source_cart_id: $sourceCartId, destination_cart_id: $destinationCartId) {
            id
            items {
                uid
            }
            ...CheckoutPageFragment
        }
    }
    ${CheckoutPageFragment}
`;

export const REMOVE_ITEM_FROM_CART = gql`
    mutation RemoveItemFromCart($cartId: String!, $itemId: ID!) {
        removeItemFromCart(input: { cart_id: $cartId, cart_item_uid: $itemId }) {
            cart {
                id
                available_payment_methods {
                    code
                    title
                }
                ...MiniCartFragment
                ...CartPageFragment
                ...AvailableShippingMethodsCartFragment
            }
        }
    }
    ${MiniCartFragment}
    ${CartPageFragment}
    ${AvailableShippingMethodsCartFragment}
`;

export const UPDATE_CART_ITEMS = gql`
    mutation UpdateCartItems($cartId: String!, $itemId: ID!, $quantity: Float!) {
        updateCartItems(input: { cart_id: $cartId, cart_items: [{ cart_item_uid: $itemId, quantity: $quantity }] }) {
            cart {
                id
                available_payment_methods {
                    code
                    title
                }
                ...CartPageFragment
                ...AvailableShippingMethodsCartFragment
            }
        }
    }
    ${CartPageFragment}
    ${AvailableShippingMethodsCartFragment}
`;

export default {
    mergeCartsMutation: MERGE_CARTS,
    removeItemFromCartMutation: REMOVE_ITEM_FROM_CART,
    updateCartItemsMutation: UPDATE_CART_ITEMS
};
