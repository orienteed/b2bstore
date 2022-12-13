import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Dialog from '../../../Dialog';
import Field from '../../../Field';
import TextInput from '../../../TextInput';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import { useIntl, FormattedMessage } from 'react-intl';
import defaultClasses from './addUserModal.module.css';
import Checkbox from '../../../Checkbox';
import Password from '../../../Password';
import Select from '../../../Select';

const AddUserModal = ({ onCancel, isOpen, onConfirm, formProps, userRoles=[], modalType }) => {
    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses);

    const userRoleMap = [
        {
            name: formatMessage({
                id: 'companyAccount.chooseUserRole',
                defaultMessage: 'Choose user role'
            }),
            role_id: null
        },
       ...userRoles
    ]?.map(role => {
        return { value: role?.role_id, label: role?.name };
    });
    const AddUserLabel = formatMessage({
        id: 'companyAccount.AddUserLabel',
        defaultMessage: 'Add New User'
    });
    const editUserLabel = formatMessage({
        id: 'companyAccount.EditUserLabel',
        defaultMessage: 'Edit User'
    });
    const firstNameLabel = formatMessage({
        id: 'companyAccount.firstName',
        defaultMessage: 'First Name'
    });
    const lastNameLabel = formatMessage({
        id: 'global.lastName',
        defaultMessage: 'Last Name'
    });
    const CompanyEmaiLabel = formatMessage({
        id: 'global.email',
        defaultMessage: 'Email'
    });

    const userStatusLabel = formatMessage({
        id: 'companyAccount.userStatus',
        defaultMessage: 'Activate User'
    });
    const jobTitleLabel = formatMessage({
        id: 'companyAccount.jobTitle',
        defaultMessage: 'Job Title'
    });
    const phoneLabel = formatMessage({
        id: 'companyAccount.phoneNumber',
        defaultMessage: 'Phone Number'
    });

    const passwordLabel = formatMessage({
        id: 'companyAccount.password',
        defaultMessage: 'Your Password'
    });
    const selectedUserRole = userRoleMap?.find(({ value }) => value === formProps?.initialValues?.mpca_role_id);
    console.log(formProps?.initialValues?.mpca_role_id, 'formProps', {
        ...selectedUserRole,
        value: formProps?.initialValues?.mpca_role_id,
        userRoleMap
    });
    return (
        <>
            <Dialog
                title={modalType === 'addUser' ? AddUserLabel : editUserLabel}
                onCancel={onCancel}
                confirmText="Save"
                isOpen={isOpen}
                onConfirm={onConfirm}
                formProps={formProps}
            >
                <div>
                    <div className={classes.sectionTitle}>
                        <span>
                            <FormattedMessage id={'companyAccount.userInfo'} defaultMessage="User Information" />
                        </span>
                    </div>
                    <>
                        <div className={classes.firstname}>
                            <Field id="firstname" label={firstNameLabel}>
                                <TextInput field="firstname" validate={isRequired} data-cy="firstname" />
                            </Field>
                        </div>
                        <div className={classes.lastname}>
                            <Field id="lastname" label={lastNameLabel}>
                                <TextInput field="lastname" validate={isRequired} data-cy="lastname" />
                            </Field>
                        </div>
                        <div className={classes.email}>
                            <Field id="email" label={CompanyEmaiLabel}>
                                <TextInput validate={isRequired} field="email" data-cy="email" />
                            </Field>
                        </div>
                    </>
                    <div className={classes.sectionTitle}>
                        <span>
                            <FormattedMessage id={'companyAccount.CompanyRole'} defaultMessage="Company Role" />
                        </span>
                    </div>
                    <>
                        {userRoleMap && (
                            <div className={classes.userStatus}>
                                <Select
                                    field="mpca_role_id"
                                    items={userRoleMap}
                                    disabled={false}
                                    initialValue={formProps?.initialValues?.mpca_role_id || userRoleMap[0]}
                                />
                            </div>
                        )}
                        <div className={classes.email}>
                            <Field id="mpca_job_title" label={jobTitleLabel}>
                                <TextInput field="mpca_job_title" data-cy="mpca_job_title" />
                            </Field>
                        </div>
                        <div className={classes.telephone}>
                            <Field id="mpca_telephone" label={phoneLabel}>
                                <TextInput field="mpca_telephone" data-cy="mpca_telephone" />
                            </Field>
                        </div>
                        <div className={classes.userStatus}>
                            <Checkbox field="mpca_is_active" label={userStatusLabel} />
                        </div>
                    </>
                    <>
                        <div className={classes.sectionTitle}>
                            <span>
                                <FormattedMessage
                                    id={'companyAccount.UserVerification'}
                                    defaultMessage="Current User Identity Verification"
                                />
                            </span>
                        </div>
                        <div className={classes.telephone}>
                            <Password
                                fieldName="password"
                                label={passwordLabel}
                                validate={isRequired}
                                isToggleButtonHidden={false}
                                data-cy="password"
                            />
                        </div>
                    </>
                </div>
            </Dialog>
        </>
    );
};

export default AddUserModal;
