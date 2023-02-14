import { gql } from '@apollo/client';

export const GET_WISHLIST_CONFIG = gql`
	query GetWishlistConfigForWishlistPageAC {
		storeConfig {
			store_code
			magento_wishlist_general_is_enabled
			enable_multiple_wishlists
			maximum_number_of_wishlists
		}
	}
`;

export default {
	getWishlistConfigQuery: GET_WISHLIST_CONFIG
};
