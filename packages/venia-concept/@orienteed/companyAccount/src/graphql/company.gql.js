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
        $region_id: Int
        $legal_name: String
        $vat_id: String
        $reseller_id: String
    ) {
        saveMpCompany(
            input: {
                legal_name: $legal_name
                city: $city
                country_id: $country_id
                email: $email
                name: $name
                postcode: $postcode
                street: $street
                telephone: $telephone
                region_id: $region_id
                reseller_id: $reseller_id
                vat_id: $vat_id
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
        deleteMpCompanyUser(entity_id: $entity_id, password: $password)
    }
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
const COMPANY_USERS_ROLES = gql`
    query mpCompanyAccountsUserRoles {
        mpCompanyAccountsUserRoles {
            allow_all
            company_id
            created_at
            name
            order_amount
            order_quantity
            role_id
            updated_at
            user_rules {
                created_at
                permission
                resource_id
                role_id
                rule_id
                updated_at
                __typename
            }
        }
    }
`;

const CREATE_USER_ROLE = gql`
    mutation createMpCompanyUserRole($input: UserRolesInput!, $password: String!) {
        createMpCompanyUserRole(input: $input, password: $password) {
            allow_all
            company_id
            created_at
            name
            order_amount
            order_quantity
            role_id
            updated_at
            user_rules {
                created_at
                permission
                resource_id
                role_id
                rule_id
                updated_at
                __typename
            }
        }
    }
`;

const SAVE_USER_ROLE = gql`
    mutation saveMpCompanyUserRole($input: UserRolesInput!, $role_id: Int!, $password: String!) {
        saveMpCompanyUserRole(input: $input, password: $password, role_id: $role_id) {
            allow_all
            company_id
            created_at
            name
            order_amount
            order_quantity
            role_id
            updated_at
            user_rules {
                created_at
                permission
                resource_id
                role_id
                rule_id
                updated_at
                __typename
            }
        }
    }
`;

const DELETE_USER_ROLE = gql`
    mutation deleteMpCompanyUserRole($role_id: Int!, $password: String!) {
        deleteMpCompanyUserRole(role_id: $role_id, password: $password)
    }
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
    getCompanyOrders: COMPANY_ORDERS,
    getCompanyUsers: COMPANY_USERS,
    getLocale: GET_LOCALE,
    createUserRole: CREATE_USER_ROLE,
    editUserRole: SAVE_USER_ROLE,
    getUserRules: COMPANY_USERS_ROLES,
    deleteUserRole: DELETE_USER_ROLE
};
