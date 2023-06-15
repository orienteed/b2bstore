import { gql } from '@apollo/client';

export const GET_PRODUCTS_IN_WISHLISTS = gql`
    query GetProductsInWishlists {
        customerWishlistProducts @client
    }
`;

export default {
    getProductsInWishlistsQuery: GET_PRODUCTS_IN_WISHLISTS
};
