import { gql } from '@apollo/client';

export const GET_STORE_CONFIG = gql`
	query getStoreConfigForCartPage {
		storeConfig {
			store_code
			product_url_suffix
			configurable_thumbnail_source
		}
	}
`;

export default {
	getStoreConfigQuery: GET_STORE_CONFIG
};
