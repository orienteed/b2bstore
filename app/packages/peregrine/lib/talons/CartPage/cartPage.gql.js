import { gql } from '@apollo/client';

import { AvailableShippingMethodsCartFragment } from './PriceAdjustments/ShippingMethods/shippingMethodsFragments.gql.js';
import { CartPageFragment } from './cartPageFragments.gql';
import { CheckoutPageFragment } from '../CheckoutPage/checkoutPageFragments.gql';
import { MiniCartFragment } from '../MiniCart/miniCartFragments.gql';

export const IS_USER_AUTHED = gql`
    query IsUserAuthed($cartId: String!) {
        cart(cart_id: $cartId) {
            # The purpose of this query is to check that the user is authorized
            # to query on the current cart. Just fetch "id" to keep it small.
            id
        }
    }
`;

export const MERGE_CARTS = gql`
    mutation MergeCarts($sourceCartId: String!, $destinationCartId: String!) {
        mergeCarts(source_cart_id: $sourceCartId, destination_cart_id: $destinationCartId) {
            id
            items {
                uid
            }
            ...CheckoutPageFragment
        }
    }
    ${CheckoutPageFragment}
`;

export default {
    IsUserAuthedQuery: IS_USER_AUTHED,
    mergeCartsMutation: MERGE_CARTS
};
