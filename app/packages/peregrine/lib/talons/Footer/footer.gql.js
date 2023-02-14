import { gql } from '@apollo/client';

export const GET_COPYRIGHT = gql`
	query storeConfigData {
		storeConfig {
			store_code
			copyright
		}
	}
`;

export default {
	getCopyrightQuery: GET_COPYRIGHT
};
