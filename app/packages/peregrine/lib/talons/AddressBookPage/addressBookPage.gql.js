import { gql } from '@apollo/client';

import { CustomerAddressBookAddressFragment } from './addressBookFragments.gql';

export const UPDATE_CUSTOMER_ADDRESS = gql`
    mutation UpdateCustomerAddressInAddressBook($addressId: Int!, $updated_address: CustomerAddressInput!) {
        updateCustomerAddress(id: $addressId, input: $updated_address) {
            id
            ...CustomerAddressBookAddressFragment
        }
    }
    ${CustomerAddressBookAddressFragment}
`;

export const GET_CUSTOMER_ADDRESSES = gql`
    query GetCustomerAddressesForAddressBook {
        customer {
            id
            addresses {
                id
                ...CustomerAddressBookAddressFragment
            }
        }
        countries {
            id
            full_name_locale
        }
    }
    ${CustomerAddressBookAddressFragment}
`;

export default {
    getCustomerAddressesQuery: GET_CUSTOMER_ADDRESSES,
    updateCustomerAddressMutation: UPDATE_CUSTOMER_ADDRESS
};
