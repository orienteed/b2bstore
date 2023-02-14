import { gql } from '@apollo/client';
import { CustomerAddressBookAddressFragment } from '@magento/peregrine/lib/talons/AddressBookPage/addressBookFragments.gql';

import { AccountInformationPageFragment } from './accountInformationPageFragment.gql';

export const SET_CUSTOMER_INFORMATION = gql`
	mutation SetCustomerInformation($customerInput: CustomerInput!) {
		updateCustomer(input: $customerInput) {
			customer {
				...AccountInformationPageFragment
			}
		}
	}
	${AccountInformationPageFragment}
`;

export const CHANGE_CUSTOMER_PASSWORD = gql`
	mutation ChangeCustomerPassword($currentPassword: String!, $newPassword: String!) {
		changeCustomerPassword(currentPassword: $currentPassword, newPassword: $newPassword) {
			email
		}
	}
`;

export const GET_CUSTOMER_INFORMATION = gql`
	query GetCustomerInformation {
		customer {
			...AccountInformationPageFragment
		}
	}
	${AccountInformationPageFragment}
`;

export const GET_CUSTOMER_ADDRESSES = gql`
	query GetCustomerAddressesForAddressBook {
		customer {
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

export const ADD_NEW_CUSTOMER_ADDRESS = gql`
	mutation AddNewCustomerAddressToAddressBook($address: CustomerAddressInput!) {
		createCustomerAddress(input: $address) {
			# We don't manually write to the cache to update the collection
			# after adding a new address so there's no need to query for a bunch
			# of address fields here. We use refetchQueries to refresh the list.
			id
		}
	}
`;

export const UPDATE_CUSTOMER_ADDRESS = gql`
	mutation UpdateCustomerAddressInAddressBook($addressId: Int!, $updated_address: CustomerAddressInput!) {
		updateCustomerAddress(id: $addressId, input: $updated_address) {
			id
			...CustomerAddressBookAddressFragment
		}
	}
	${CustomerAddressBookAddressFragment}
`;

export const DELETE_CUSTOMER_ADDRESS = gql`
	mutation DeleteCustomerAddressFromAddressBook($addressId: Int!) {
		deleteCustomerAddress(id: $addressId)
	}
`;

export default {
	mutations: {
		setCustomerInformationMutation: SET_CUSTOMER_INFORMATION,
		changeCustomerPasswordMutation: CHANGE_CUSTOMER_PASSWORD,
		createCustomerAddressMutation: ADD_NEW_CUSTOMER_ADDRESS,
		deleteCustomerAddressMutation: DELETE_CUSTOMER_ADDRESS,
		updateCustomerAddressMutation: UPDATE_CUSTOMER_ADDRESS
	},
	queries: {
		getCustomerInformationQuery: GET_CUSTOMER_INFORMATION,
		getCustomerAddressesQuery: GET_CUSTOMER_ADDRESSES
	}
};
