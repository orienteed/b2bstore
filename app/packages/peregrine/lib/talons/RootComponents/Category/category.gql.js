import { gql } from '@apollo/client';

import { CategoryFragment, ProductsFragment } from './categoryFragments.gql';

export const GET_CATEGORY = gql`
    query GetCategory(
        $id: String!
        $pageSize: Int!
        $currentPage: Int!
        $filters: ProductAttributeFilterInput!
        $sort: ProductAttributeSortInput,
        $includeProductAlert: Boolean = false
    ) {
        categories(filters: { category_uid: { in: [$id] } }) {
            items {
                uid
                ...CategoryFragment
            }
        }
        products(pageSize: $pageSize, currentPage: $currentPage, filter: $filters, sort: $sort) {
            items {
                color
                mp_product_alert @include(if: $includeProductAlert) {
                    mp_productalerts_price_alert
                    mp_productalerts_stock_notify
                }
                ... on ConfigurableProduct {
                    variants {
                        product {
                            mp_product_alert @include(if: $includeProductAlert) {
                                mp_productalerts_price_alert
                                mp_productalerts_stock_notify
                            }
                        }
                    }
                }
            }
            ...ProductsFragment
        }
    }
    ${CategoryFragment}
    ${ProductsFragment}
`;

export const GET_FILTER_INPUTS = gql`
    query GetFilterInputs {
        __type(name: "ProductAttributeFilterInput") {
            inputFields {
                name
                type {
                    name
                }
            }
        }
    }
`;

export default {
    getCategoryQuery: GET_CATEGORY,
    getFilterInputsQuery: GET_FILTER_INPUTS
};
