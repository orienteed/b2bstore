import { gql } from '@apollo/client';

export const GET_PRODUCT_FOR_QUICK_ORDER_BY_SKU = gql`
    query GetProductDetailForQuickOrderBySku($sku: String!) {
        products(search: $sku) {
            items {
                orParentSku
                id
                uid
                name
                sku
                price {
                    minimalPrice {
                        amount {
                            value
                            currency
                        }
                    }
                    regularPrice {
                        amount {
                            value
                            currency
                        }
                    }
                }
            }
            total_count
        }
    }
`;

export default {
    getProductBySkuQuery: GET_PRODUCT_FOR_QUICK_ORDER_BY_SKU
};
