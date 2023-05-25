import { gql } from '@apollo/client';

export const IS_EMAIL_AVAILABLE = gql`
    query IsEmailAvailable($email: String!) {
        isEmailAvailable(email: $email) {
            is_email_available
        }
    }
`;

export default {
    isEmailAvailableQuery: IS_EMAIL_AVAILABLE
};
