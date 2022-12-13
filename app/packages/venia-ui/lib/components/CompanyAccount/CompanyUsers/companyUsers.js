import React, { Suspense } from 'react';
import { useStyle } from '../../../classify';
import SideMenu from '../SideMenu';
import TableUsers from './TableUsers';
import { FormattedMessage } from 'react-intl';
import defaultClasses from './companyUsers.module.css';
import FullPageLoadingIndicator from '../../LoadingIndicator';
import Button from '../../Button';
import { useCompanyAccountUsers } from '@magento/peregrine/lib/talons/CompanyAccount/useCompanyAccountUsers';
const AddUserModal = React.lazy(() => import('./AddUserModal'));
const DeleteModal = React.lazy(() => import('./DeleteModal'));

const CompanyUsers = () => {
    const {
        companyUsers,
        userRoles,
        handleAddNewUsersBtn,
        loading,
        openAddUserModal,
        submitAddUsers,
        handelCancelModal,
        modalType,
        handleEditUser,
        handleOpenDeleteModal,
        selectedUser,
        deleteFormProps,
        handleDeleteUser,
        isOpenDeleteModal,
        formProps
    } = useCompanyAccountUsers({});
    const classes = useStyle(defaultClasses);

    if (loading) {
        return <FullPageLoadingIndicator />;
    }
    return (
        <div>
            <div className={classes.titleContainer}>
                <h2>
                    <FormattedMessage id={'companyAccount.users'} defaultMessage="Users" />
                </h2>
            </div>
            <div className={classes.contentContainer}>
                <div>
                    <SideMenu />
                </div>
                <div>
                    <div className={classes.addUser}>
                        <Button onClick={() => handleAddNewUsersBtn('addUser')} priority={'high'}>
                            <FormattedMessage id={'companyAccount.addNewUser'} defaultMessage="Add new user" />
                        </Button>
                    </div>
                    <div className={classes.tableContainer}>
                        <TableUsers
                            handleOpenDeleteModal={handleOpenDeleteModal}
                            handleEditUser={handleEditUser}
                            users={companyUsers?.mpCompanyAccountsUsers}
                        />
                    </div>
                </div>
            </div>
            <Suspense fallback={null}>
                <AddUserModal
                    onCancel={handelCancelModal}
                    isOpen={openAddUserModal}
                    onConfirm={submitAddUsers}
                    formProps={formProps}
                    userRoles={userRoles?.mpCompanyAccountsUserRoles}
                    modalType={modalType}
                />
                <DeleteModal user={selectedUser} onCancel={handelCancelModal} isOpen={isOpenDeleteModal} onConfirm={handleDeleteUser} formProps={deleteFormProps} />
            </Suspense>
        </div>
    );
};

export default CompanyUsers;
