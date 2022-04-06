import { gql } from '@apollo/client';

export const GET_FULL_CATALOG_REGULAR_PRICE = gql`
    query getFullCatalogRegularPrice {
        products(filter: { sku: { eq: "" } }) {
            items {
                ... on ConfigurableProduct {
                    variants {
                        product {
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
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const GET_FULL_CATALOG_DISCOUNT_PRICE = gql`
    query getFullCatalogDiscountPrice {
        products(filter: { sku: { eq: "" } }) {
            items {
                ... on ConfigurableProduct {
                    variants {
                        product {
                            name
                            sku
                            description {
                                html
                            }
                            categories {
                                name
                            }
                            price {
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
            }
        }
    }
`;
