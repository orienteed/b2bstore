import React, { Suspense } from 'react';
import SideMenu from '../SideMenu';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { FormattedMessage } from 'react-intl';
import FullPageLoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useCompanyAccountUserRoles } from '@orienteed/companyAccount/src/talons/useCompanyAccountUserRoles';
import defaultClasses from './userRoles.module.css';
import UserRolesTable from './UserRolesTable';
import Button from '@magento/venia-ui/lib/components/Button';
const AddUserRole = React.lazy(() => import('./AddUserRole'));
const DeleteModal = React.lazy(() => import('./DeleteModal'));

const userRoles = () => {
    const classes = useStyle(defaultClasses);
    const {
        userRoles,
        loading,
        submitAddUserRole,
        handelCancelModal,
        formProps,
        handleAddNewRolesBtn,
        openAddUserModal,
        handleOpenDeleteModal,
        selectedUserRole,
        isOpenDeleteModal,
        handleDeleteUser,
        deleteFormProps,
        modalType
    } = useCompanyAccountUserRoles({});

    if (loading) {
        return <FullPageLoadingIndicator />;
    }

    return (
        <div>
            <div className={classes.titleContainer}>
                <h2>
                    <FormattedMessage id={'companyAccount.userRoles'} defaultMessage="User Roles" />
                </h2>
            </div>
            <div className={classes.contentContainer}>
                <div>
                    <SideMenu />
                </div>
                <div>
                    <div className={classes.addUser}>
                        <Button onClick={() => handleAddNewRolesBtn('addUserRole')} priority={'high'}>
                            <FormattedMessage id={'companyAccount.addNewUserRole'} defaultMessage="Add new user Role" />
                        </Button>
                    </div>
                    <div className={classes.tableContainer}>
                        <UserRolesTable
                            userRoles={userRoles?.mpCompanyAccountsUserRoles}
                            handleOpenDeleteModal={handleOpenDeleteModal}
                        />
                    </div>
                </div>
            </div>
            <Suspense fallback={null}>
                <AddUserRole
                    onCancel={handelCancelModal}
                    isOpen={openAddUserModal}
                    onConfirm={submitAddUserRole}
                    formProps={formProps}
                    userRoles={userRoles?.mpCompanyAccountsUserRoles}
                    modalType={modalType}
                />
                <DeleteModal
                    userRole={selectedUserRole}
                    onCancel={handelCancelModal}
                    isOpen={isOpenDeleteModal}
                    onConfirm={handleDeleteUser}
                    formProps={deleteFormProps}
                />
            </Suspense>
        </div>
    );
};

export default userRoles;
