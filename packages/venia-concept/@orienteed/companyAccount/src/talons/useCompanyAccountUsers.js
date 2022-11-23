import React, { useCallback, useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from '../graphql/company.gql';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useToasts } from '@magento/peregrine';
import { AlertCircle as AlertCircleIcon } from 'react-feather';
import Icon from '@magento/venia-ui/lib/components/Icon';

const errorIcon = <Icon src={AlertCircleIcon} size={20} />;

export const useCompanyAccountUsers = props => {
    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const [openAddUserModal, setOpenAddUserModal] = useState(false);
    const [modalType, setModalType] = useState();
    const [selectedUser, setSelectedUser] = useState();
    const [deleteForm, setdeleteForm] = useState();
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const { getCompanyUsers, getUserRules, createUserRole, createUser, updateUser, deleteUser } = operations;
    const [, { addToast }] = useToasts();
    const [formAddress, setFormAddress] = useState();
    const formProps = {
        initialValues: formAddress || selectedUser
    };

    const deleteFormProps = {
        initialValues: deleteForm
    };

    const { data: companyUsers, loading: companyUsersLoading, refetch } = useQuery(getCompanyUsers, {
        fetchPolicy: 'no-cache'
    });
    const [submitUserRole] = useMutation(createUserRole);
    const [createNewUser, { data: UsersData }] = useMutation(createUser);
    const [editUser, { data: updatedUserData }] = useMutation(updateUser);
    const [submitDeleteUser] = useMutation(deleteUser);
    const { data: userRoles, loading: UserRolesLoading } = useQuery(getUserRules, {
        fetchPolicy: 'no-cache'
    });
    const handleAddNewUsersBtn = type => {
        setOpenAddUserModal(true);
        setModalType(type);
      
    };

    const handelCancelModal = () => {
        setOpenAddUserModal(false);
        setSelectedUser();
        setIsOpenDeleteModal(false);
    };

    const submitAddUsers = useCallback(
        async formValues => {
            const { password, mpca_role_id, ...rest } = formValues;
            if (modalType === 'addUser') {
                try {
                    await createNewUser({
                        variables: {
                            password,
                            input: {
                                mpca_role_id: mpca_role_id.value,
                                ...rest
                            }
                        }
                    });
                    setOpenAddUserModal(false);
                    refetch();
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
                    const { entity_id } = selectedUser;
                    await editUser({
                        variables: {
                            password,
                            entity_id,
                            input: {
                                mpca_role_id: mpca_role_id.value || mpca_role_id,
                                ...rest
                            }
                        }
                    });
                    setOpenAddUserModal(false);
                    refetch();
                    setSelectedUser();
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
        [modalType, selectedUser]
    );
    const handleEditUser = user => {
        setSelectedUser(user);
        setOpenAddUserModal(true);
        setModalType('edit');
    };

    const handleOpenDeleteModal = user => {
        setIsOpenDeleteModal(true);
        setSelectedUser(user);
    };

    const handleDeleteUser = useCallback(
        async formValues => {
            const { password } = formValues;
            try {
                const { entity_id } = selectedUser;
                await submitDeleteUser({
                    variables: {
                        password,
                        entity_id
                    }
                });
                setIsOpenDeleteModal(false);
                refetch();
                setSelectedUser();
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
        [selectedUser]
    );

    return {
        companyUsers,
        userRoles,
        handleAddNewUsersBtn,
        openAddUserModal,
        submitAddUsers,
        handelCancelModal,
        formProps,
        deleteFormProps,
        modalType,
        handleEditUser,
        handleOpenDeleteModal,
        handleDeleteUser,
        selectedUser,
        setIsOpenDeleteModal,
        isOpenDeleteModal,
        loading: companyUsersLoading || UserRolesLoading
    };
};
