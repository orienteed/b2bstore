import { gql } from '@apollo/client';

const subscriberOutput = gql`
    fragment subscriberOutput on MpSubscriberOutput {
        customer_email
        customer_group
        customer_id
        last_send_date
        old_price
        product_id
        send_count
        status
        store_id
        subscribe_created_at
        subscribe_updated_at
        subscriber_id
        type
        website_id
        __typename
    }
`;

export const SUBMIT_GUEST_STOCK_ALERT = gql`
    mutation MpProductAlertNotifyInStock($productSku: String!, $email: String!) {
        MpProductAlertNotifyInStock(input: { productSku: $productSku, email: $email }) {
            ...subscriberOutput
        }
    }
    ${subscriberOutput}
`;

export const SUBMIT_DELETE_ALERT = gql`
    mutation MpProductAlertSubscriberDelete($id: Int!) {
        MpProductAlertSubscriberDelete(input: { id: $id })
    }
`;

export const GET_CONFIG_ALERTS = gql`
    query MpProductAlertsConfigs {
        MpProductAlertsConfigs {
            price_alert {
                popup_setting {
                    button_text
                    description
                    footer_content
                    heading_text
                    place_holder
                }
            }
            stock_alert {
                popup_setting {
                    button_text
                    description
                    footer_content
                    heading_text
                    place_holder
                }
            }
        }
    }
`;

const GET_LOCALE = gql`
    query {
        storeConfig {
            locale
            store_code
        }
    }
`;

export default {
    SUBMIT_GUEST_STOCK_ALERT,
    SUBMIT_DELETE_ALERT,
    GET_CONFIG_ALERTS,
    GET_LOCALE
};
