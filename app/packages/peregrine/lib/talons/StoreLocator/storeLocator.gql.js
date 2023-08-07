import { gql } from '@apollo/client';

export const GET_STOREID = gql`
    query StoreConfig {
        storeConfig {
            id
            store_code
        }
    }
`;

const SUBMIT_LOCATION = gql`
    mutation SaveLocationMpStoreLocator($locationId: String!, $timePickup: String!, $cartId: String) {
        SaveLocationMpStoreLocator(input: { locationId: $locationId, timePickup: $timePickup, cartId: $cartId })
    }
`;

export default {
    submitLocation: SUBMIT_LOCATION,
    getStoreId: GET_STOREID
};
