import { gql } from '@apollo/client';

export const GET_WISHLIST_CONFIG = gql`
	query GetWishlistConfigForWishlistPageMOS {
		storeConfig {
			store_code
			magento_wishlist_general_is_enabled
		}
	}
`;

export default {
	getWishlistConfigQuery: GET_WISHLIST_CONFIG
};
