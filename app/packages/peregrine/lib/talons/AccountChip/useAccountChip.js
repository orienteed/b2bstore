import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { useUserContext } from '@magento/peregrine/lib/context/user';

import mergeOperations from '../../util/shallowMerge';
import DEFAULT_OPERATIONS from '../AccountInformationPage/accountInformationPage.gql';

/**
 * The useAccountChip talon supports the AccountChip component.
 *
 * @param {GraphQLAST} props.queries.getCustomerInformationQuery
 *
 * @returns {Object} talonProps
 * @returns {Object} talonProps.currentUser - Details about the currently signed-in user.
 * @returns {Bool}   talonProps.isLoadingUserName - Indicates when we know there is a
 *  user signed in, but we don't yet have their name.
 * @returns {Bool}   talonProps.isUserSignedIn - Indicates whether we have a signed-in user.
 */
export const useAccountChip = () => {
    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getCustomerInformationQuery } = operations;

    const [{ isSignedIn: isUserSignedIn }] = useUserContext();

    const { data } = useQuery(getCustomerInformationQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !isUserSignedIn
    });

    const currentUser = useMemo(() => {
        return (data && data.customer) || null;
    }, [data]);

    return {
        currentUser,
        isLoadingUserName: isUserSignedIn && !currentUser,
        isUserSignedIn
    };
};
