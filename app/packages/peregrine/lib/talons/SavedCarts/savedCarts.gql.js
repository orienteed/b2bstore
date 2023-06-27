import { gql } from '@apollo/client';

export const SHARE_CART = gql`
    mutation ShareSavedCarts($cartId: String!, $token: String!) {
        mpSaveCartShareCart(cart_id: $cartId, token: $token)
    }
`;

export default {
    shareSavedCartsMutation: SHARE_CART
};
