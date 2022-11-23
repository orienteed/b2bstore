import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Dialog from '@magento/venia-ui/lib/components/Dialog';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import { useIntl, FormattedMessage } from 'react-intl';
import defaultClasses from './addUserRole.module.css';
import Password from '@magento/venia-ui/lib/components/Password';

const AddUserRole = ({ onCancel, isOpen, onConfirm, formProps, userRoles = [], modalType }) => {
    const classes = useStyle(defaultClasses);
    const { formatMessage } = useIntl();

    const AddUserRoleLabel = formatMessage({
        id: 'companyAccount.addNewUserRole',
        defaultMessage: 'Add new user role'
    });
    const editUserRoleLabel = formatMessage({
        id: 'global.editwUserRole',
        defaultMessage: 'Edit user Role'
    });
    const RoleNameLabel = formatMessage({
        id: 'global.nameRole',
        defaultMessage: 'Role Name'
    });
    const RoleResourceLabel = formatMessage({
        id: 'global.roleResource',
        defaultMessage: 'Role Resource'
    });
    const quantityLabel = formatMessage({
        id: 'global.quantityLabel',
        defaultMessage: 'Order Quantity Limit per User'
    });
    const amountLabel = formatMessage({
        id: 'global.roleAmount',
        defaultMessage: 'Amount Limit Per Order'
    });
    const passwordLabel = formatMessage({
        id: 'companyAccount.password',
        defaultMessage: 'Your Password'
    });
    return (
        <>
            <Dialog
                title={modalType === 'addUserRole' ? AddUserRoleLabel : editUserRoleLabel}
                onCancel={onCancel}
                confirmText="Save"
                isOpen={isOpen}
                onConfirm={onConfirm}
                formProps={formProps}
            >
                <div>
                    <div className={classes.sectionTitle}>
                        <span>Role Information</span>
                    </div>
                    <>
                        <div className={classes.name}>
                            <Field id="name" label={RoleNameLabel}>
                                <TextInput field="name" validate={isRequired} data-cy="name" />
                            </Field>
                        </div>
                    </>
                    <div className={classes.sectionTitle}>
                        <span>Role Resource</span>
                    </div>
                    <></>
                    <div className={classes.sectionTitle}>
                        <span>Additional Permissions</span>
                    </div>
                    <>
                        <div className={classes.name}>
                            <Field id="order_quantity" label={quantityLabel}>
                                <TextInput type='number' field="order_quantity" data-cy="order_quantity" />
                            </Field>
                        </div>
                        <div className={classes.name}>
                            <Field id="order_amount" label={amountLabel}>
                                <TextInput field="order_amount" data-cy="order_amount" />
                            </Field>
                        </div>
                    </>

                    <div className={classes.sectionTitle}>
                        <span>
                            <FormattedMessage
                                id={'companyAccount.UserVerification'}
                                defaultMessage="Current User Identity Verification"
                            />
                        </span>
                    </div>
                    <div className={classes.password}>
                        <Password
                            fieldName="password"
                            label={passwordLabel}
                            validate={isRequired}
                            isToggleButtonHidden={false}
                            data-cy="password"
                        />
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default AddUserRole;
