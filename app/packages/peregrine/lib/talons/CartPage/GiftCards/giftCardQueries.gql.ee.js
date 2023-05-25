import { gql } from '@apollo/client';

import { CartPageFragment } from '../cartPageFragments.gql';

const REMOVE_GIFT_CARD_FROM_CART = gql`
    mutation RemoveGiftCardFromCart($cartId: String!, $giftCardCode: String!) {
        removeGiftCardFromCart(input: { cart_id: $cartId, gift_card_code: $giftCardCode }) {
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
    removeGiftCardFromCartMutation: REMOVE_GIFT_CARD_FROM_CART
};
