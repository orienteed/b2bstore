import { gql } from '@apollo/client';

import { CartPageFragment } from '../../cartPageFragments.gql';

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
    removeCouponFromCartMutation: REMOVE_COUPON_FROM_CART
};
