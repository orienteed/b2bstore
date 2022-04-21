// import { gql } from '@apollo/client';

// import { CategoryFragment, ProductsFragment } from './categoryFragments.gql';

// export const GET_CATEGORY = gql`
//     query GetCategories(
//         $id: String!
//         $pageSize: Int!
//         $currentPage: Int!
//         $filters: ProductAttributeFilterInput!
//         $sort: ProductAttributeSortInput
//     ) {
//         categories(filters: { category_uid: { in: [$id] } }) {
//             # eslint-disable-next-line @graphql-eslint/require-id-when-available
//             items {
//                 uid
//                 meta_title
//                 meta_keywords
//                 meta_description
//             }
//         }
//         products(
//             pageSize: $pageSize
//             currentPage: $currentPage
//             filter: $filters
//             sort: $sort
//         ) {
//             items {
//                 ... on ConfigurableProduct {
//                     variants {
//                         product {
//                             name
//                             sku
//                             description {
//                                 html
//                             }
//                             categories {
//                                 name
//                             }
//                             price {
//                                 regularPrice {
//                                     amount {
//                                         currency
//                                         value
//                                     }
//                                 }
//                                 minimalPrice {
//                                     amount {
//                                         currency
//                                         value
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 }
//                 id
//                 uid
//                 name
//                 price_range {
//                     maximum_price {
//                         regular_price {
//                             currency
//                             value
//                         }
//                     }
//                 }
//                 sku
//                 small_image {
//                     url
//                 }
//                 stock_status
//                 rating_summary
//                 __typename
//                 url_key
//                 url_suffix
//             }
//             page_info {
//                 total_pages
//             }
//             total_count
//         }
//     }
// `;

// export const GET_FILTER_INPUTS = gql`
//     query GetFilterInputsForCategory {
//         __type(name: "ProductAttributeFilterInput") {
//             inputFields {
//                 name
//                 type {
//                     name
//                 }
//             }
//         }
//     }
// `;

// export default {
//     getCategoryQuery: GET_CATEGORY,
//     getFilterInputsQuery: GET_FILTER_INPUTS
// };

// import { gql } from '@apollo/client';

// export const GET_CATEGORY = gql`
//     query GetCategories(
//         $id: Int!
//         $pageSize: Int!
//         $currentPage: Int!
//         $filters: ProductAttributeFilterInput!
//         $sort: ProductAttributeSortInput
//     ) {
//         category(id: $id) {
//             id
//             description
//             name
//             product_count
//             meta_title
//             meta_keywords
//             meta_description
//         }
//         products(
//             pageSize: $pageSize
//             currentPage: $currentPage
//             filter: $filters
//             sort: $sort
//         ) {
//             items {
//
//                 id
//                 name
//                 categories {
//                     name
//                 }
//                 description {
//                     html
//                 }
//                 sku
//                 price {
//                     regularPrice {
//                         amount {
//                             currency
//                             value
//                         }
//                     }
//                     minimalPrice {
//                         amount {
//                             currency
//                             value
//                         }
//                     }
//                 }
//                 small_image {
//                     url
//                 }
//                 url_key
//                 url_suffix
//             }
//             page_info {
//                 total_pages
//             }
//             total_count
//         }
//     }
// `;

// export const GET_FILTER_INPUTS = gql`
//     query GetFilterInputsForCategory {
//         __type(name: "ProductAttributeFilterInput") {
//             inputFields {
//                 name
//                 type {
//                     name
//                 }
//             }
//         }
//     }
// `;

// export default {
//     getCategoryQuery: GET_CATEGORY,
//     getFilterInputsQuery: GET_FILTER_INPUTS
// };
