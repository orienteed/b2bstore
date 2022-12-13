import { gql } from '@apollo/client';

export const CompanyOutput = gql`
    fragment CompanyOutput on CompanyOutput {
        administrator_id
        city
        company_id
        country_id
        created_at
        customer_group_id
        email
        legal_name
        name
        postcode
        region
        region_id
        reseller_id
        sales_representative_id
        status
        street
        updated_at
        telephone
        vat_id
        __typename
    }
`;

export const UsersOutput = gql`
    fragment UsersOutput on UsersOutput {
        email
        entity_id
        firstname
        lastname
        mpca_is_active
        mpca_job_title
        mpca_role_id
        mpca_telephone
        __typename
    }
`;

export const OrdersOutput = gql`
fragment OrdersOutput on OrdersOutput {
      
    date
    grand_total
    id
    order_number
    placed_by
    ship_to
    status
    __typename
  }
`;