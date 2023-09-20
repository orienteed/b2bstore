import { gql } from '@apollo/client';


import { ShippingInformationFragment } from '../CheckoutPage/ShippingInformation/shippingInformationFragments.gql';


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
    getCustomerCartAddressQuery: GET_CUSTOMER_CART_ADDRESSES
};
