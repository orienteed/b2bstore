import { gql } from '@apollo/client';

export const GET_PRODUCTS_DETAILS_BY_SEARCH = gql`
    query GetProductsDetailsBySearch(
        $currentPage: Int = 1
        $inputText: String!
        $pageSize: Int = 6
        $filters: ProductAttributeFilterInput!
        $sort: ProductAttributeSortInput
    ) {
        products(currentPage: $currentPage, pageSize: $pageSize, search: $inputText, filter: $filters, sort: $sort) {
            items {
                id
                uid
                name
                small_image {
                    url
                }
                url_key
                url_suffix
                orParentUrlKey
                price {
                    regularPrice {
                        amount {
                            value
                            currency
                        }
                    }
                    minimalPrice {
                        amount {
                            currency
                            value
                        }
                    }
                }
                price_range {
                    maximum_price {
                        regular_price {
                            currency
                            value
                        }
                    }
                }
                sku
                small_image {
                    url
                }
                stock_status
                __typename
                url_key
                ... on ConfigurableProduct {
                    configurable_options {
                        attribute_code
                        attribute_id
                        uid
                        label
                        values {
                            default_label
                            label
                            store_label
                            use_default_value
                            value_index
                            uid
                            swatch_data {
                                ... on ImageSwatchData {
                                    thumbnail
                                }
                                value
                            }
                        }
                    }
                    variants {
                        attributes {
                            code
                            value_index
                        }
                        product {
                            stock_status
                            uid
                            name
                            sku
                            description {
                                html
                            }
                            categories {
                                name
                            }
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
                        }
                    }
                }

                custom_attributes {
                    attribute_metadata {
                        label
                    }
                    selected_attribute_options {
                        attribute_option {
                            label
                        }
                    }
                }
            }

            page_info {
                total_pages
            }
            total_count
        }
    }
`;

export default {
    getProductsDetailsBySearchQuery: GET_PRODUCTS_DETAILS_BY_SEARCH
};
