import { useCallback } from 'react';
import { useQuery } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './company.gql';

export const useCompanyAccountOrders = () => {
    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getCompanyOrders } = operations;

    const { data: companyOrders, loading: companyOrdersLoading } = useQuery(getCompanyOrders, {
        fetchPolicy: 'no-cache'
    });

    const handelCancelModal = () => {
        // setOpenAddUserModal(false);
        // setSelectedUser();
        // setIsOpenDeleteModal(false);
    };

    const handleReOrderBtn = useCallback(() => {}, []);

    return {
        companyOrders,
        handelCancelModal,
        loading: companyOrdersLoading,
        handleReOrderBtn
    };
};