import { gql } from '@apollo/client';

export const CategoryFragment = gql`
    # eslint-disable-next-line @graphql-eslint/require-id-when-available
    fragment CategoryFragment on CategoryTree {
        uid
        meta_title
        meta_keywords
        meta_description
    }
`;

export const ProductsFragment = gql`
    fragment ProductsFragment on Products {
        items {
            id
            uid
            ... on ConfigurableProduct {
                variants {
                    product {
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
            name
            price_range {
                maximum_price {
                    regular_price {
                        currency
                        value
                    }
                }
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
            sku
            small_image {
                url
            }
            stock_status

            rating_summary
            type_id
            __typename
            url_key
            url_suffix
        }
        page_info {
            total_pages
        }
        total_count
    }
`;
