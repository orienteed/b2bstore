import { gql } from '@apollo/client';

export const GET_CUSTOMER = gql`
    query GetCustomerForCheckout {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        customer {
            firstname
            email
        }
    }
`;

export const MP_RMA_CONFIG = gql`
    query mpRMAConfig {
        mpRMAConfig {
            reason {
                content
                value
            }
            additional_field {
                content
                is_require
                sort
                type
                validation
                value
            }
            solution {
                content
                value
            }
        }
    }
`;

export const RMA_REQUEST_LIST = gql`
    query {
        customer {
            mp_rma {
                total_count
                __typename
                items {
                    updated_at
                    status {
                        label
                        __typename
                        status_id
                    }
                    comment
                    created_at
                    customer_email
                    increment_id
                    order_id
                    order_increment_id
                    request_id
                    request_item {
                        currency
                        additional_fields
                        price
                        qty_rma
                        solution
                        reason
                        sku
                        name
                    }
                    files
                    is_canceled
                    request_shipping_label {
                        shipping_label_id
                        request_id
                    }
                    request_reply {
                        author_name
                        content
                        created_at
                        files
                        is_customer_notified
                        is_visible_on_front
                        reply_id
                        request_id
                        type
                        __typename
                    }
                }
            }
        }
    }
`;

export const MP_RMA_REQUEST = gql`
    mutation mpRMARequest(
        $order_increment_id: String!
        $comment: String
        $status_id: Int
        $upload: [MpRmaUploadInput]
        $request_item: [MpRmaRequestItemsInput]
        $reason: String
        $solution: String
        $additional_fields: [MpRmaAdditionalFieldsInput]
    ) {
        mpRMARequest(
            order_increment_id: $order_increment_id
            comment: $comment
            status_id: $status_id
            upload: $upload
            request_item: $request_item
            reason: $reason
            solution: $solution
            additional_fields: $additional_fields
        ) {
            comment
            customer_email
        }
    }
`;

export const GET_CUSTOMER_ORDERS = gql`
    query GetCustomerOrders {
        customer {
            id
            orders {
                items {
                    id
                    store_id
                    billing_address {
                        city
                        country_code
                        firstname
                        lastname
                        region
                        street
                    }
                    items {
                        id
                        product_name
                        product_sale_price {
                            currency
                            value
                        }
                        product_sku
                        quantity_ordered
                    }
                    number
                    order_date
                    status
                }
                total_count
            }
        }
    }
`;

export const MPCANCEL_RMA_REQUEST = gql`
    mutation mpRMARequestCancel($request_id: Int!) {
        mpRMARequestCancel(request_id: $request_id)
    }
`;

export const GET_PRODUCT_ID = gql`
    query productDetailBySku($inputText: String!) {
        products(search: $inputText, currentPage: 1, pageSize: 3, filter: { sku: { eq: $inputText } }) {
            items {
                name
                id
                uid
            }
        }
    }
`;

export const REQUEST_CONVERSATION = gql`
    mutation mpRMARequestConversation($request_id: Int!, $upload: [MpRmaUploadInput], $content: String) {
        mpRMARequestConversation(request_id: $request_id, content: $content, upload: $upload) {
            author_name
            content
        }
    }
`;
