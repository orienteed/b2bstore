import { gql } from '@apollo/client';

export const GET_PAYMENT_NONCE = gql`
    query GetPaymentNonce($cartId: String!) {
        cart(cart_id: $cartId) @client {
            id
            paymentNonce
        }
    }
`;

export default {
    getPaymentNonceQuery: GET_PAYMENT_NONCE
};
