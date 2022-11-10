import { gql } from '@apollo/client';
import { CompanyOutput, UsersOutput, OrdersOutput } from './companyFragment.gql';

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

const CREATE_USER = gql`
    mutation createMpCompanyUser($input: UsersInput!, $password: String!) {
        createMpCompanyUser(input: $input, password: $password) {
            ...UsersOutput
        }
    }
    ${UsersOutput}
`;

const UPDATE_USER = gql`
    mutation saveMpCompanyUser($entity_id: Int!, $input: UsersInput, $password: String!) {
        saveMpCompanyUser(entity_id: $entity_id, input: $input, password: $password) {
            ...UsersOutput
        }
    }
    ${UsersOutput}
`;

const DELETE_USER = gql`
    mutation deleteMpCompanyUser($entity_id: Int!, $password: String!) {
        deleteMpCompanyUser(entity_id: $entity_id, password: $password) {
            ...UsersOutput
        }
    }
    ${UsersOutput}
`;

const GET_LOCALE = gql`
    query getLocale {
        storeConfig {
            store_code
            locale
        }
    }
`;

const COMPANY_ORDERS = gql`
    query mpCompanyAccountsOrders {
        mpCompanyAccountsOrders {
            ...OrdersOutput
        }
    }
    ${OrdersOutput}
`;

const COMPANY_USERS = gql`
    query mpCompanyAccountsUsers {
        mpCompanyAccountsUsers {
            ...UsersOutput
        }
    }
    ${UsersOutput}
`;

export default {
    registerCompany: REGISTER_COMPANY,
    updateCompayInfo: UPDATE_COMPONY_INFO,
    companyData: COMPANY_DATA,
    createUser: CREATE_USER,
    updateUser: UPDATE_USER,
    deleteUser: DELETE_USER,
    getCompanyOrders:COMPANY_ORDERS,
    getCompanyUsers:COMPANY_USERS,
    getLocale: GET_LOCALE
};
