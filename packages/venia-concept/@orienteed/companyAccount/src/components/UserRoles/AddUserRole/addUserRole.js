import React, { useState } from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Dialog from '@magento/venia-ui/lib/components/Dialog';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import { useIntl, FormattedMessage } from 'react-intl';
import defaultClasses from './addUserRole.module.css';
import Password from '@magento/venia-ui/lib/components/Password';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import UserRules from './UserRules';

const AddUserRole = ({ onCancel, isOpen, onConfirm, formProps, modalType }) => {
    const classes = useStyle(defaultClasses);
    const { formatMessage } = useIntl();
    const [isRulesOpen, setIsRulesOpen] = useState(true);
    const AddUserRoleLabel = formatMessage({
        id: 'companyAccount.addNewUserRole',
        defaultMessage: 'Add new user role'
    });
    const editUserRoleLabel = formatMessage({
        id: 'companyAccount.editUserRole',
        defaultMessage: 'Edit user Role'
    });
    const RoleNameLabel = formatMessage({
        id: 'companyAccount.roleName',
        defaultMessage: 'Role Name'
    });
    const quantityLabel = formatMessage({
        id: 'companyAccount.quantityLabel',
        defaultMessage: 'Order Quantity Limit per User'
    });
    const amountLabel = formatMessage({
        id: 'companyAccount.roleAmount',
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
                        <span>
                            <FormattedMessage id={'companyAccount.roleInformation'} defaultMessage="Role Information" />
                        </span>
                    </div>
                    <>
                        <div className={classes.name}>
                            <Field id="name" label={RoleNameLabel}>
                                <TextInput field="name" validate={isRequired} data-cy="name" />
                            </Field>
                        </div>
                    </>
                    <div className={classes.sectionTitle}>
                        <span>
                            {' '}
                            <FormattedMessage id={'companyAccount.roleResource'} defaultMessage="Role Resource" />
                        </span>
                    </div>
                    <>
                        <Checkbox
                            field="allow_all"
                            onChange={e => setIsRulesOpen(!e.target.checked)}
                            label={formatMessage({
                                id: 'companyAccount.ResourceAccess',
                                defaultMessage: 'All Resource Access'
                            })}
                        />
                        {isRulesOpen && <UserRules />}
                    </>
                    <div className={classes.sectionTitle}>
                        <span>
                            <FormattedMessage
                                id={'companyAccount.additionalPermissions'}
                                defaultMessage="Additional Permissions"
                            />
                        </span>
                    </div>
                    <>
                        <div className={classes.name}>
                            <Field id="order_quantity" label={quantityLabel}>
                                <TextInput type="number" field="order_quantity" data-cy="order_quantity" />
                            </Field>
                        </div>
                        <div className={classes.name}>
                            <Field id="order_amount" label={amountLabel}>
                                <TextInput type="number" field="order_amount" data-cy="order_amount" />
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
