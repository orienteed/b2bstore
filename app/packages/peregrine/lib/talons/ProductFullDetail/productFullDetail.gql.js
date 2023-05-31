import { gql } from '@apollo/client';

import { CartPageFragment } from '../CartPage/cartPageFragments.gql';

const UPDATE_CONFIGURABLE_OPTIONS = gql`
    mutation UpdateConfigurableOptions(
        $cartId: String!
        $cartItemId: ID!
        $parentSku: String!
        $variantSku: String!
        $quantity: Float!
    ) {
        addConfigurableProductsToCart(
            input: {
                cart_id: $cartId
                cart_items: [{ data: { quantity: $quantity, sku: $variantSku }, parent_sku: $parentSku }]
            }
        ) {
            cart {
                id
            }
        }

        removeItemFromCart(input: { cart_id: $cartId, cart_item_uid: $cartItemId }) {
            cart {
                id
                ...CartPageFragment
            }
        }
    }
    ${CartPageFragment}
`;

export default {
    updateConfigurableOptionsMutation: UPDATE_CONFIGURABLE_OPTIONS
};
