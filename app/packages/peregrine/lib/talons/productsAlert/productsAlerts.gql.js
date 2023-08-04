import { gql } from '@apollo/client';

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
    SUBMIT_DELETE_ALERT,
    GET_CONFIG_ALERTS,
    GET_LOCALE
};
