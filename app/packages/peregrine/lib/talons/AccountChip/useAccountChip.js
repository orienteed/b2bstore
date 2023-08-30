import { useMemo } from 'react';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

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
    const { getCustomerInformation } = useAdapter();

    const [{ isSignedIn: isUserSignedIn }] = useUserContext();

    const { data } = getCustomerInformation({
        hasSkip: true,
        isSignedIn: isUserSignedIn,
        hasNextFetchPolicy: true,
        hasFetchPolicy: true
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
