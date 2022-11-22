import React, { useCallback, useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from '../graphql/company.gql';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useToasts } from '@magento/peregrine';
import { AlertCircle as AlertCircleIcon } from 'react-feather';
import Icon from '@magento/venia-ui/lib/components/Icon';

const errorIcon = <Icon src={AlertCircleIcon} size={20} />;

export const useCompanyAccountOrders = props => {
    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getCompanyOrders } = operations;
    const [, { addToast }] = useToasts();
    const [formAddress, setFormAddress] = useState();

    const { data: companyOrders, loading: companyOrdersLoading, refetch } = useQuery(getCompanyOrders, {
        fetchPolicy: 'no-cache'
    });

    const handelCancelModal = () => {
        // setOpenAddUserModal(false);
        // setSelectedUser();
        // setIsOpenDeleteModal(false);
    };

    const handleReOrderBtn = useCallback(order => {}, []);

    return {
        companyOrders,
        handelCancelModal,
        loading: companyOrdersLoading,
        handleReOrderBtn
    };
};
