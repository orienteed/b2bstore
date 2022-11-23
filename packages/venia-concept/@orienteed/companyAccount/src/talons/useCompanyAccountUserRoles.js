import React, { useCallback, useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from '../graphql/company.gql';
import { useToasts } from '@magento/peregrine';
import { AlertCircle as AlertCircleIcon } from 'react-feather';
import Icon from '@magento/venia-ui/lib/components/Icon';

const errorIcon = <Icon src={AlertCircleIcon} size={20} />;

export const useCompanyAccountUserRoles = props => {
    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [openAddUserModal, setOpenAddUserModal] = useState(false);
    const [selectedUserRole, setSelectedUserRole] = useState();
    const [deleteForm, setdeleteForm] = useState();
    const [modalType, setModalType] = useState();
    const [formAddress, setFormAddress] = useState();
    const [, { addToast }] = useToasts();

    const formProps = {
        initialValues: formAddress
    };
    const deleteFormProps = {
        initialValues: deleteForm
    };
    const { getUserRules, createUserRole, deleteUserRole } = operations;
    const [submitUserRole, { data: addUserRole }] = useMutation(createUserRole);
    const [submitDeleteUserRole] = useMutation(deleteUserRole);
    const { data: userRoles, loading: userRolesLoading, refetch } = useQuery(getUserRules, {
        fetchPolicy: 'no-cache'
    });

    const handleAddNewRolesBtn = type => {
        setOpenAddUserModal(true);
        setModalType(type);
    };

    const submitAddUserRole = useCallback(
        async formValues => {
            console.log(formValues, 'formValues');
            const { password, ...rest } = formValues;
            // setOpenAddUserModal();
            submitUserRole({
                variables: {
                    password,
                    input: {
                        allow_all: false,
                        ...rest,
                        user_rules: [
                            //     {
                            //         resource_id: '23',
                            //         permission: 'permission'
                            //     }
                        ]
                    }
                }
            });
        },
        [modalType]
    );

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
                console.log(formValues, 'formValues', role_id);
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
        [selectedUserRole]
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
        handleAddNewRolesBtn
    };
};
