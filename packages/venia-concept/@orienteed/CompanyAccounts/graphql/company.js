import { gql } from '@apollo/client';

const CompanyOutput = gql`
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
const COMPANY_DATA = gql`
    query mpCompanyAccounts {
        mpCompanyAccounts {
            ...CompanyOutput
        }
    }
    ${CompanyOutput}
`;

const REGISTER_COMPANY = gql`
    mutation registerMpCompany(
        $city: String!
        $country_id: String!
        $email: String!
        $name: String!
        $street: String!
        $telephone: String!
        $postcode: String!
        $region_id: Int!
    ) {
        registerMpCompany(
            input: {
                city: $city
                country_id: $country_id
                email: $email
                name: $name
                postcode: $postcode
                street: $street
                telephone: $telephone
                region_id: $region_id
            }
        ) {
            ...CompanyOutput
        }
    }
    ${CompanyOutput}
`;

const UPDATE_COMPONY_INFO = gql`
    mutation updateCompany(
        $city: String!
        $country_id: String!
        $email: String!
        $name: String!
        $street: String!
        $telephone: String!
        $postcode: String!
        $region_id: Int!
    ) {
        saveMpCompany(
            input: {
                city: $city
                country_id: $country_id
                email: $email
                name: $name
                postcode: $postcode
                street: $street
                telephone: $telephone
                region_id: $region_id
            }
        ) {
            ...CompanyOutput
        }
    }
    ${CompanyOutput}
`;

const GET_LOCALE = gql`
    query getLocale {
        storeConfig {
            store_code
            locale
        }
    }
`;

export default {
    registerCompany: REGISTER_COMPANY,
    updateCompayInfo: UPDATE_COMPONY_INFO,
    companyData: COMPANY_DATA,
    GET_LOCALE
};
