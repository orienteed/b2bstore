import { gql } from '@apollo/client';

export const GET_SAVED_CARTS = gql`
    query GetSavedCarts($pageSize: Int, $currentPage: Int) {
        mpSaveCartGetCarts(currentPage: $currentPage, pageSize: $pageSize) {
            total_count
            page_info {
                current_page
                page_size
            }
            items {
                cart_id
                created_at
                cart_name
                description
                share_url
                token
                cart_total {
                    currency
                    value
                }
                items {
                    cart_id
                    cart_item_id
                    product_name
                    image
                    price
                    qty
                    sku
                    subtotal_converted
                }
            }
        }
    }
`;

export const RESTORE_SAVED_CARTS = gql`
    mutation RestoreSavedCarts($cartId: String!, $token: String!) {
        mpSaveCartRestoreCart(cart_id: $cartId, token: $token)
    }
`;

export const SAVE_CART = gql`
    mutation SaveSavedCarts($cartId: String!, $cartName: String!, $description: String) {
        o_mpSaveCart(cart_id: $cartId, cart_name: $cartName, description: $description)
    }
`;

export const SHARE_CART = gql`
    mutation ShareSavedCarts($cartId: String!, $token: String!) {
        mpSaveCartShareCart(cart_id: $cartId, token: $token)
    }
`;

export default {
    getSavedCartsQuery: GET_SAVED_CARTS,
    restoreSavedCartsMutation: RESTORE_SAVED_CARTS,
    saveSavedCartsMutation: SAVE_CART,
    shareSavedCartsMutation: SHARE_CART
};
