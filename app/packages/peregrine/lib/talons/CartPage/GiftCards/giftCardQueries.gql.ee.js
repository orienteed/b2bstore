import { gql } from '@apollo/client';

import { CartPageFragment } from '../cartPageFragments.gql';

const GET_GIFT_CARD_BALANCE = gql`
    query GetGiftCardBalance($giftCardCode: String!) {
        giftCardAccount(input: { gift_card_code: $giftCardCode }) {
            balance {
                currency
                value
            }
            code
            expiration_date
            id: code
        }
    }
`;

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
    getGiftCardBalanceQuery: GET_GIFT_CARD_BALANCE,
    removeGiftCardFromCartMutation: REMOVE_GIFT_CARD_FROM_CART
};
