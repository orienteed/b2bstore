import { gql } from '@apollo/client';

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
    getProductItemsFilteredByCategoryQuery: GET_PRODUCT_ITEMS_FILTERED_BY_CATEGORY
};
