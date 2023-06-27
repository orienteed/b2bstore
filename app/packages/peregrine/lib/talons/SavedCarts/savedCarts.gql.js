import { gql } from '@apollo/client';

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
    saveSavedCartsMutation: SAVE_CART,
    shareSavedCartsMutation: SHARE_CART
};
