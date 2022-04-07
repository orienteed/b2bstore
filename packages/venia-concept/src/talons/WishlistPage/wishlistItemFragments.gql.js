import { gql } from '@apollo/client';

export const WishlistItemFragment = gql`
    fragment WishlistItemFragment on WishlistItemInterface {
        id
        product {
            id
            image {
                label
                url
            }
            name
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
            price_range {
                maximum_price {
                    final_price {
                        currency
                        value
                    }
                }
            }
            sku
            stock_status
            ... on ConfigurableProduct {
                variants {
                    attributes {
                        uid
                        code
                        value_index
                    }
                    product {
                        stock_status
                        id
                        thumbnail {
                            url
                        }
                    }
                }
                configurable_options {
                    id
                    attribute_code
                    attribute_id
                    attribute_id_v2
                    label
                    values {
                        uid
                        default_label
                        label
                        store_label
                        use_default_value
                        value_index
                        swatch_data {
                            ... on ImageSwatchData {
                                thumbnail
                            }
                            value
                        }
                    }
                }
            }
        }
        ... on ConfigurableWishlistItem {
            configurable_options {
                id
                option_label
                value_id
                value_label
            }
        }
    }
`;
