import { gql } from '@apollo/client';

export const GET_CUSTOMER_ORDERS_FOR_CSR = gql`
    query GetCustomerOrdersForCsr {
        customer {
            orders {
                items {
                    number
                    order_date
                    status
                    total {
                        grand_total {
                            currency
                            value
                        }
                    }
                    items {
                        product_sku
                    }
                }
            }
        }
    }
`;

export default {
    getCustomerOrdersForCsrQuery: GET_CUSTOMER_ORDERS_FOR_CSR
};
