import React, { useCallback, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './company.gql';
import { useToasts } from '@magento/peregrine';
import { AlertCircle as AlertCircleIcon } from 'react-feather';
import Icon from '@magento/venia-ui/lib/components/Icon';

const errorIcon = <Icon src={AlertCircleIcon} size={20} />;

export const useCompanyAccountUserRoles = () => {
    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [openAddUserModal, setOpenAddUserModal] = useState(false);
    const [selectedUserRole, setSelectedUserRole] = useState();
    const [deleteForm] = useState();
    const [modalType, setModalType] = useState();
    const [formAddress] = useState();
    const [, { addToast }] = useToasts();

    const formProps = {
        initialValues: formAddress || selectedUserRole
    };
    const deleteFormProps = {
        initialValues: deleteForm
    };
    const { getUserRules, createUserRole, deleteUserRole, editUserRole } = operations;
    const [submitUserRole] = useMutation(createUserRole);
    const [submitDeleteUserRole] = useMutation(deleteUserRole);
    const [submitEditUserRole] = useMutation(editUserRole);
    const { data: userRoles, loading: userRolesLoading, refetch } = useQuery(getUserRules, {
        fetchPolicy: 'no-cache'
    });

    const handleAddNewRolesBtn = type => {
        setOpenAddUserModal(true);
        setModalType(type);
    };

    const submitAddUserRole = useCallback(
        async formValues => {
            const { password, name, allow_all, order_amount, order_quantity, ...rest } = formValues;
            const permissions = Object.keys(rest).map(resource_id => {
                return {
                    resource_id,
                    permission: 'allow'
                };
            });
            if (modalType === 'addUserRole') {
                try {
                    submitUserRole({
                        variables: {
                            password,
                            input: {
                                allow_all,
                                name,
                                order_amount,
                                order_quantity,
                                user_rules: permissions
                            }
                        }
                    });
                        refetch();
                    setOpenAddUserModal();
                } catch (error) {
                    addToast({
                        type: 'error',
                        icon: errorIcon,
                        message: String(error),
                        dismissable: true,
                        timeout: 7000
                    });
                }
            } else {
                try {
                    submitEditUserRole({
                        variables: {
                            password,
                            role_id: selectedUserRole?.company_id,
                            input: {
                                allow_all,
                                name,
                                order_amount,
                                order_quantity,
                                user_rules: permissions
                            }
                        }
                    });
                    setTimeout(() => {
                        refetch();
                    }, 500);
                    setOpenAddUserModal();
                } catch (error) {
                    addToast({
                        type: 'error',
                        icon: errorIcon,
                        message: String(error),
                        dismissable: true,
                        timeout: 7000
                    });
                }
            }
        },
        [selectedUserRole, modalType, submitUserRole, setOpenAddUserModal, refetch, addToast, submitEditUserRole]
    );

    const handleEditUser = userRole => {
        setOpenAddUserModal(true);
        setModalType('EditUserRole');
        const userRules = {};
        userRole?.user_rules?.forEach(ele => {
            if (ele?.permission === 'allow') {
                userRules[(ele?.resource_id)] = true;
            }
        });
        setSelectedUserRole({ ...userRole, ...userRules });
    };

    const handelCancelModal = () => {
        setSelectedUserRole();
        setOpenAddUserModal(false);
        setIsOpenDeleteModal(false);
    };

    const handleOpenDeleteModal = rule => {
        setIsOpenDeleteModal(true);
        setSelectedUserRole(rule);
    };

    const handleDeleteUser = useCallback(
        async formValues => {
            const { password } = formValues;
            try {
                const { role_id } = selectedUserRole;
                await submitDeleteUserRole({
                    variables: {
                        password,
                        role_id
                    }
                });
                setIsOpenDeleteModal(false);
                refetch();
                setSelectedUserRole();
            } catch (error) {
                addToast({
                    type: 'error',
                    icon: errorIcon,
                    message: String(error),
                    dismissable: true,
                    timeout: 7000
                });
            }
        },
        [selectedUserRole, refetch, addToast, submitDeleteUserRole]
    );
    return {
        userRoles,
        formProps,
        loading: userRolesLoading,
        submitAddUserRole,
        handelCancelModal,
        openAddUserModal,
        modalType,
        handleOpenDeleteModal,
        selectedUserRole,
        isOpenDeleteModal,
        handleDeleteUser,
        deleteFormProps,
        handleAddNewRolesBtn,
        handleEditUser
    };
};
