import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import Dialog from '@magento/venia-ui/lib/components/Dialog';
import defaultClasses from './deleteModal.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Password from '@magento/venia-ui/lib/components/Password';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

const DeleteModal = ({ onCancel, isOpen, onConfirm, user, formProps }) => {
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses);
    const name = ' ' + user?.firstname + ' ' + user?.lastname;
    const addUserLabel = formatMessage({
        id: 'companyAccount.confirmDeleteUser',
        defaultMessage: 'Confirm Delete User'
    });
    const passwordLabel = formatMessage({
        id: 'companyAccount.password',
        defaultMessage: 'Your Password'
    });
    return (
        <div className={classes.dialogWrapper}>
            <Dialog
                formProps={formProps}
                title={addUserLabel}
                onCancel={onCancel}
                confirmText="Delte"
                isOpen={isOpen}
                onConfirm={onConfirm}
            >
                <span className={classes.content}>
                    <FormattedMessage id={'companyAccount.confirmDelete'} defaultMessage="Confirm delete" />
                    {name}
                    <div className={classes.password}>
                        <Password
                            fieldName="password"
                            label={passwordLabel}
                            validate={isRequired}
                            isToggleButtonHidden={false}
                            data-cy="password"
                        />
                    </div>
                </span>
            </Dialog>
        </div>
    );
};

export default DeleteModal;
