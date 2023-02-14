import { gql } from '@apollo/client';

import { SET_CUSTOMER_ADDRESS_ON_CART } from '../ShippingInformation/shippingInformation.gql';
import { ShippingInformationFragment } from '../ShippingInformation/shippingInformationFragments.gql';
import { CustomerAddressFragment } from './addressBookFragments.gql';

export const GET_CUSTOMER_ADDRESSES = gql`
	query GetCustomerAddresses {
		customer {
			addresses {
				id
				...CustomerAddressFragment
			}
		}
	}
	${CustomerAddressFragment}
`;

export const GET_CUSTOMER_CART_ADDRESS = gql`
	query GetCustomerCartAddress {
		customerCart {
			id
			...ShippingInformationFragment
		}
	}
	${ShippingInformationFragment}
`;

export default {
	setCustomerAddressOnCartMutation: SET_CUSTOMER_ADDRESS_ON_CART,
	getCustomerAddressesQuery: GET_CUSTOMER_ADDRESSES,
	getCustomerCartAddressQuery: GET_CUSTOMER_CART_ADDRESS
};
