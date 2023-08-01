import { gql } from '@apollo/client';

export const GET_PRODUCT_DETAIL_FOR_CMS_DYNAMIC_BLOCK_BY_URL_KEY = gql`
    query GetProductDetailForCmsDynamicBlockByUrlKey($urlKey: String!) {
        products(filter: { url_key: { eq: $urlKey } }) {
            items {
                uid
                url_key
            }
        }
    }
`;

export default {
    getProductDetailQuery: GET_PRODUCT_DETAIL_FOR_CMS_DYNAMIC_BLOCK_BY_URL_KEY
};
