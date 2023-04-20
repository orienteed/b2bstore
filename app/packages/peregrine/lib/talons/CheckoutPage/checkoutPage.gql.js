import { gql } from '@apollo/client';

import { CheckoutPageFragment } from './checkoutPageFragments.gql';
import { OrderConfirmationPageFragment } from './OrderConfirmationPage/orderConfirmationPageFragments.gql';

export const GET_CHECKOUT_DETAILS = gql`
    query GetCheckoutDetails($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...CheckoutPageFragment
        }
    }
    ${CheckoutPageFragment}
`;

// A query to fetch order details _right_ before we submit, so that we can pass
// data to the order confirmation page.
export const GET_ORDER_DETAILS = gql`
    query GetOrderDetails($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...OrderConfirmationPageFragment
        }
    }
    ${OrderConfirmationPageFragment}
`;

export default {
    getCheckoutDetailsQuery: GET_CHECKOUT_DETAILS,
    getOrderDetailsQuery: GET_ORDER_DETAILS
};
