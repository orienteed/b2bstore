import { gql } from '@apollo/client';

import { AppliedCouponsFragment } from './couponCodeFragments.gql';
import { CartPageFragment } from '../../cartPageFragments.gql';

const GET_APPLIED_COUPONS = gql`
    query GetAppliedCoupons($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...AppliedCouponsFragment
        }
    }
    ${AppliedCouponsFragment}
`;

const REMOVE_COUPON_FROM_CART = gql`
    mutation RemoveCouponFromCart($cartId: String!) {
        removeCouponFromCart(input: { cart_id: $cartId }) {
            cart {
                id
                ...CartPageFragment
                # If this mutation causes "free" to become available we need to know.
                available_payment_methods {
                    code
                    title
                }
            }
        }
    }
    ${CartPageFragment}
`;

export default {
    getAppliedCouponsQuery: GET_APPLIED_COUPONS,
    removeCouponFromCartMutation: REMOVE_COUPON_FROM_CART
};
