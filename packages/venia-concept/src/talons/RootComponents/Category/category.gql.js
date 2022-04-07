import { gql } from '@apollo/client';

import { CategoryFragment, ProductsFragment } from './categoryFragments.gql';

export const GET_CATEGORY = gql`
    query GetCategories(
        $id: Int!
        $pageSize: Int!
        $currentPage: Int!
        $filters: ProductAttributeFilterInput!
        $sort: ProductAttributeSortInput
    ) {
        category(id: $id) {
            id
            ...CategoryFragment
        }
        products(
            pageSize: $pageSize
            currentPage: $currentPage
            filter: $filters
            sort: $sort
        ) {
            items {
                # id is always required, even if the fragment includes it.
                id
                # TODO: Once this issue is resolved we can use a
                # GalleryItemFragment here:
                # https://github.com/magento/magento2/issues/28584
                name
                categories {
                    name
                }
                description {
                    html
                }
                sku
                price {
                    regularPrice {
                        amount {
                            currency
                            value
                        }
                    }
                    minimalPrice {
                        amount {
                            currency
                            value
                        }
                    }
                }
                small_image {
                    url
                }
                url_key
                url_suffix
            }
            page_info {
                total_pages
            }
            total_count
        }
    }
    ${CategoryFragment}
`;

export const GET_FILTER_INPUTS = gql`
    query GetFilterInputsForCategory {
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
