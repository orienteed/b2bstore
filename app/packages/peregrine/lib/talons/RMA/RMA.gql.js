import { gql } from '@apollo/client';

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
                type
                sort
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
                    status_id
                    comment
                    created_at
                    customer_email
                    increment_id
                    order_id
                    order_increment_id
                    request_id
                    request_item {
                        additional_fields
                        price
                        qty_rma
                        solution
                        reason
                        sku
                        name
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
        $upload: MpRmaUploadInput
        $request_item: MpRmaRequestItemsInput
        $reason: String
        $solution: String
        $additional_fields: MpRmaAdditionalFieldsInput
    ) {
        mpRMAConfig(
            order_increment_id: $order_increment_id
            comment: $comment
            status_id: $status_id
            upload: [$upload]
            request_item: [$request_item]
            reason: $reason
            solution: $solution
            additional_fields: [$additional_fields]
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
