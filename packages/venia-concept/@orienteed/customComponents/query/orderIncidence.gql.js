import { gql } from '@apollo/client';

export const GET_CONFIGURABLE_THUMBNAIL_SOURCE = gql`
    query getConfigurableThumbnailSource {
        storeConfig {
            store_code
            id
            configurable_thumbnail_source
        }
    }
`;

export const GET_PRODUCT_THUMBNAILS_BY_URL_KEY = gql`
    query GetProductThumbnailsByURLKey($urlKeys: [String!]!) {
        products(filter: { url_key: { in: $urlKeys } }) {
            items {
                uid
                id
                sku
                thumbnail {
                    label
                    url
                }
                url_key
                ... on ConfigurableProduct {
                    variants {
                        product {
                            sku
                            uid
                            id
                            thumbnail {
                                label
                                url
                            }
                        }
                    }
                }
            }
        }
    }
`;

export default {
    getProductThumbnailsQuery: GET_PRODUCT_THUMBNAILS_BY_URL_KEY,
    getConfigurableThumbnailSource: GET_CONFIGURABLE_THUMBNAIL_SOURCE
};
