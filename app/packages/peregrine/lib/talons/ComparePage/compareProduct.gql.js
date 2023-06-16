import { gql } from '@apollo/client';

export const GET_CUSTOMER_COMPARE_LIST = gql`
    query GetCustomerCompareList {
        customer {
            compare_list {
                item_count
                uid
                items {
                    uid
                    attributes {
                        value
                        code
                    }
                    product {
                        name
                        small_image {
                            url
                        }
                        url_suffix
                        stock_status
                        url_key
                        uid
                        price_range {
                            maximum_price {
                                final_price {
                                    value
                                }
                                regular_price {
                                    currency
                                    value
                                }
                            }
                            minimum_price {
                                regular_price {
                                    value
                                    currency
                                }
                                final_price {
                                    value
                                    currency
                                }
                            }
                        }
                        description {
                            html
                        }
                        sku
                    }
                }
            }
        }
    }
`;

export default {
    getCustomerCompareListQuery: GET_CUSTOMER_COMPARE_LIST
};
