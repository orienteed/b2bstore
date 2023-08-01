import { gql } from '@apollo/client';

export const GET_AVAILABLE_SORT_METHODS_BY_CATEGORY = gql`
    query GetAvailableSortMethodsByCategory($categoryIdFilter: FilterEqualTypeInput!) {
        products(filter: { category_uid: $categoryIdFilter }) {
            sort_fields {
                options {
                    label
                    value
                }
            }
        }
    }
`;

export const GET_PRODUCT_AGGREGATIONS_FILTERED_BY_CATEGORY = gql`
    query GetProductAggregationsFilteredByCategory($categoryIdFilter: FilterEqualTypeInput!) {
        products(filter: { category_uid: $categoryIdFilter }) {
            aggregations {
                label
                count
                attribute_code
                options {
                    label
                    value
                }
                position
            }
        }
    }
`;

export const GET_PRODUCT_ITEMS_FILTERED_BY_CATEGORY = gql`
    query GetProductItemsFilteredByCategory($categoryIdFilter: FilterEqualTypeInput!) {
        products(filter: { category_uid: $categoryIdFilter }) {
            items {
                id
                uid
                __typename
                name
                url_key
                url_suffix
            }
        }
    }
`;

export default {
    getAvailableSortMethodsByCategoryQuery: GET_AVAILABLE_SORT_METHODS_BY_CATEGORY,
    getProductAggregationsFilteredByCategoryQuery: GET_PRODUCT_AGGREGATIONS_FILTERED_BY_CATEGORY,
    getProductItemsFilteredByCategoryQuery: GET_PRODUCT_ITEMS_FILTERED_BY_CATEGORY
};
