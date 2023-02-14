import { gql } from '@apollo/client';

export const GET_PAGE_SIZE = gql`
	query getPageSize {
		storeConfig {
			store_code
			grid_per_page
		}
	}
`;

export default {
	queries: {
		getPageSize: GET_PAGE_SIZE
	}
};
