import React, { useCallback, useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from '../graphql/company.gql';

export const useCompanyAccountUserRoles = props => {
    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getUserRules } = operations;
    const { data: userRoles, loading: userRolesLoading } = useQuery(getUserRules, {
        fetchPolicy: 'no-cache'
    });

    const handleAddNewrolesBtn = useCallback(ModalType => {}, []);

    return { userRoles, loading: userRolesLoading ,handleAddNewrolesBtn};
};
