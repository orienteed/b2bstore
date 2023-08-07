import { gql } from '@apollo/client';

const GET_LOCALE = gql`
    query {
        storeConfig {
            locale
            store_code
        }
    }
`;

export default {
    GET_LOCALE
};
