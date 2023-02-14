import { gql } from '@apollo/client';

export const GET_CUSTOMER = gql`
	query GetCustomerForLeftNav {
		customer {
			email
			firstname
			lastname
			is_subscribed
		}
	}
`;

const GET_ROOT_CATEGORY_ID = gql`
	query getRootCategoryId {
		storeConfig {
			store_code
			root_category_uid
		}
	}
`;

export default {
	getCustomerQuery: GET_CUSTOMER,
	getRootCategoryId: GET_ROOT_CATEGORY_ID
};
