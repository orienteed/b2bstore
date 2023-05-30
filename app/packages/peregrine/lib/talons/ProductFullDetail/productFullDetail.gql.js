import { gql } from '@apollo/client';

import { CartPageFragment } from '../CartPage/cartPageFragments.gql';
import { ProductFormFragment } from './productFullDetailFragment.gql';

const GET_PRODUCT_DETAIL_FOR_CONFIGURABLE_OPTIONS_BY_SKU = gql`
    query GetProductDetailForConfigurableOptionsBySku($sku: String) {
        products(filter: { sku: { eq: $sku } }) {
            items {
                id
                uid
                ...ProductFormFragment
            }
        }
    }
    ${ProductFormFragment}
`;

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
    getProductDetailForConfigurableOptionsBySkuQuery: GET_PRODUCT_DETAIL_FOR_CONFIGURABLE_OPTIONS_BY_SKU,
    updateConfigurableOptionsMutation: UPDATE_CONFIGURABLE_OPTIONS
};
