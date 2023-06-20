import { gql } from '@apollo/client';

export const GET_QUOTE_BY_ID = gql`
    query GetQuoteById($quote_id: Int) {
        mpQuote(quote_id: $quote_id) {
            quote {
                base_currency_code
                base_subtotal
                created_at
                customer_email
                entity_id
                items_count
                items_qty
                subtotal
                quote_currency_code
                items {
                    id
                    quote_id
                    sku
                    qty
                    name
                    prices {
                        row_total {
                            currency
                            value
                        }
                    }
                    product {
                        name
                        url_key
                        url_suffix
                        thumbnail {
                            url
                        }
                    }
                    ... on ConfigurableQuoteItem {
                        configurable_options {
                            id
                            option_label
                            value_id
                            value_label
                        }
                    }
                }
            }
        }
    }
`;

export const GET_QUOTE_LIST = gql`
    query GetQuoteList($filter: MpQuoteFilterInput, $pageSize: Int, $currentPage: Int) {
        mpQuoteList(filter: $filter, currentPage: $currentPage, pageSize: $pageSize) {
            page_info {
                current_page
                page_size
                total_pages
            }
            items {
                created_at
                quote_currency_code
                status
                subtotal
                entity_id
                expired_at
                discount
                items {
                    name
                    sku
                    request_price
                    qty
                    discount
                    prices {
                        total_item_discount {
                            currency
                            value
                        }
                        row_total {
                            currency
                            value
                        }
                        price {
                            currency
                            value
                        }
                    }
                    ... on ConfigurableQuoteItem {
                        configurable_options {
                            id
                            option_label
                            value_id
                            value_label
                        }
                    }
                }
            }
        }
    }
`;

export const SUBMIT_CURRENT_QUOTE = gql`
    mutation SubmitCurrentQuote {
        mpQuoteSubmit
    }
`;

export const UPDATE_QUOTE = gql`
    mutation UpdateQuote($input: updateMpQuoteInput!) {
        updateMpQuote(input: $input) {
            quote {
                base_currency_code
                base_subtotal
                created_at
                customer_email
                entity_id
                items_count
                items_qty
                subtotal
                quote_currency_code
                items {
                    id
                    quote_id
                    sku
                    qty
                    name
                    prices {
                        row_total {
                            currency
                            value
                        }
                    }
                    product {
                        name
                        thumbnail {
                            url
                        }
                    }
                    ... on ConfigurableQuoteItem {
                        configurable_options {
                            id
                            option_label
                            value_id
                            value_label
                        }
                    }
                }
            }
        }
    }
`;

export default {
    getQuoteByIdQuery: GET_QUOTE_BY_ID,
    getQuoteListQuery: GET_QUOTE_LIST,
    submitCurrentQuoteMutation: SUBMIT_CURRENT_QUOTE,
    updateQuoteMutation: UPDATE_QUOTE
};
