import { gql } from '@apollo/client';

// export const GET_STORE_CONFIG_DATA = gql`
//     query getStoreConfigData {
//         storeConfig {
//             store_code
//             product_url_suffix
//         }
//     }
// `;

export const MP_RMA_CONFIG = gql`
    query mpRMAConfig($storeId: Int) {
        mpRMAConfig(storeId: $storeId) {
            additional_field {
                content
            }
            reason {
                content
            }
            solution {
                content
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
