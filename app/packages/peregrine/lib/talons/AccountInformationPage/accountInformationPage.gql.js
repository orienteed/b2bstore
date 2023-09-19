import { gql } from '@apollo/client';

import { AccountInformationPageFragment } from './accountInformationPageFragment.gql';

export const GET_CUSTOMER_INFORMATION = gql`
    query GetCustomerInformation {
        customer {
            ...AccountInformationPageFragment
        }
    }
    ${AccountInformationPageFragment}
`;

export default {
    getCustomerInformationQuery: GET_CUSTOMER_INFORMATION
};
