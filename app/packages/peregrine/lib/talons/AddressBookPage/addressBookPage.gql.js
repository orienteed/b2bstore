import { gql } from '@apollo/client';

import { CustomerAddressBookAddressFragment } from './addressBookFragments.gql';
import { ShippingInformationFragment } from '../CheckoutPage/ShippingInformation/shippingInformationFragments.gql';

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

export const GET_CUSTOMER_CART_ADDRESSES = gql`
    query GetCustomerCartAddressesForAddressBook {
        customerCart {
            id
            ...ShippingInformationFragment
        }
    }
    ${ShippingInformationFragment}
`;

export default {
    getCustomerAddressesQuery: GET_CUSTOMER_ADDRESSES,
    getCustomerCartAddressQuery: GET_CUSTOMER_CART_ADDRESSES,
    updateCustomerAddressMutation: UPDATE_CUSTOMER_ADDRESS
};
