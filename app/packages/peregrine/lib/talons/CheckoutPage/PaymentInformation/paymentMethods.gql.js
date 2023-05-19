import { gql } from '@apollo/client';

export const SET_PAYMENT_METHOD_ON_CART = gql`
    mutation SetPaymentMethodOnCart($cartId: String!, $payment_method: PaymentMethodInput!) {
        setPaymentMethodOnCart(input: { cart_id: $cartId, payment_method: $payment_method }) {
            cart {
                id
                selected_payment_method {
                    code
                    title
                }
            }
        }
    }
`;

export default {
    setPaymentMethodOnCartMutation: SET_PAYMENT_METHOD_ON_CART
};
