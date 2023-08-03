import { gql } from '@apollo/client';

import { ProductDetailsFragment } from './productDetailFragment.gql';

export const GET_PRODUCT_DETAIL_FOR_PRODUCT_PAGE_BY_URL_KEY = gql`
    query GetProductDetailForProductPageByUrlKey(
        $urlKey: String!
        $includeProductAlert: Boolean = false
        $includeProductAttachment: Boolean = false
    ) {
        products(filter: { url_key: { eq: $urlKey } }) {
            items {
                mp_attachments @include(if: $includeProductAttachment) {
                    file_icon
                    file_label
                    file_name
                    file_size
                    group {
                        name
                        position
                        value
                    }
                    note
                    url_file
                    __typename
                }
                mp_product_alert @include(if: $includeProductAlert) {
                    mp_productalerts_price_alert
                    mp_productalerts_stock_notify
                }
                ... on ConfigurableProduct {
                    variants {
                        product {
                            mp_product_alert @include(if: $includeProductAlert) {
                                mp_productalerts_price_alert
                                mp_productalerts_stock_notify
                            }
                        }
                    }
                }
                id
                uid
                ...ProductDetailsFragment
            }
        }
    }
    ${ProductDetailsFragment}
`;

export default {
    getProductDetailQuery: GET_PRODUCT_DETAIL_FOR_PRODUCT_PAGE_BY_URL_KEY
};
