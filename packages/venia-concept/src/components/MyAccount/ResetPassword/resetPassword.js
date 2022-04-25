import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { shape, string } from 'prop-types';
import { Form } from 'informed';

import { useToasts } from '@magento/peregrine';
import { useResetPassword } from '../../../talons/useResetPassword';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import Button from '@magento/venia-ui/lib/components/Button';
import Field from '@magento/venia-ui/lib/components/Field';
import FormError from '@magento/venia-ui/lib/components/FormError';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import Password from '@magento/venia-ui/lib/components/Password';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import defaultClasses from '@magento/venia-ui/lib/components/MyAccount/ResetPassword/resetPassword.module.css';
import resetPasswordOperations from '@magento/venia-ui/lib/components/MyAccount/ResetPassword/resetPassword.gql';

const ResetPassword = props => {
    const { classes: propClasses } = props;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, propClasses);

    const {
        hasCompleted,
        errorPassword,
        loading,
        token,
        formErrors,
        handleSubmit
    } = useResetPassword({ ...resetPasswordOperations })

    console.log('Error: ' + formErrors);

    const PAGE_TITLE = formatMessage({
        id: 'resetPassword.pageTitleText',
        defaultMessage: 'Reset Password'
    });
    const tokenMissing = (
        <div className={classes.invalidTokenContainer}>
            <div className={classes.invalidToken}>
                <FormattedMessage
                    id={'resetPassword.invalidTokenMessage'}
                    defaultMessage={
                        'Uh oh, something went wrong. Check the link or try again.'
                    }
                />
            </div>
        </div>
    );

    const [, { addToast }] = useToasts();

    const formMsg = errorPassword ?
        <div>
            HOLA
        </div>
        : <FormError
            classes={{
                root: classes.formErrors
            }}
            errors={formErrors}
        />

    const recoverPasswordTest = hasCompleted ?
        <div className={classes.successMessageContainer}>
            <div className={classes.successMessage}>
                <FormattedMessage
                    id={'resetPassword.successMessage'}
                    defaultMessage={
                        'Your new password has been saved. Please use this password to sign into your Account.'
                    }
                />
            </div>
        </div> 
        :
        <Form className={classes.container} onSubmit={handleSubmit}>
            {formMsg}
            <div className={classes.description}>
                <FormattedMessage
                    id={'resetPassword.descriptionText'}
                    defaultMessage={
                        'Please enter your email address and new password.'
                    }
                />
            </div>
            <Field label={'Email address'}>
                <TextInput field={'email'} validate={isRequired} />
            </Field>
            <Password
                classes={{
                    root: classes.password
                }}
                label={formatMessage({
                    id: 'resetPassword.newPasswordText',
                    defaultMessage: 'New Password'
                })}
                fieldName={'newPassword'}
                isToggleButtonHidden={false}
            />
            <Password
                classes={{
                    root: classes.password
                }}
                label={formatMessage({
                    id: 'resetPassword.newPasswordConfirmText',
                    defaultMessage: 'New Password Confirm'
                })}
                fieldName={'newPasswordConfirm'}
                isToggleButtonHidden={false}
            />
            <Button
                className={classes.submitButton}
                type="submit"
                priority="high"
                disabled={loading}
            >
                <FormattedMessage
                    id="resetPassword.savePassword"
                    defaultMessage="Save Password"
                />
            </Button>
        </Form>

    return (
        <div className={classes.root}>
            <StoreTitle>{PAGE_TITLE}</StoreTitle>
            <h1 className={classes.heading}>{PAGE_TITLE}</h1>
            {token ? recoverPasswordTest : tokenMissing}
        </div>
    );
};

export default ResetPassword;

ResetPassword.propTypes = {
    classes: shape({
        container: string,
        description: string,
        errorMessage: string,
        heading: string,
        invalidToken: string,
        invalidTokenContainer: string,
        password: string,
        root: string,
        submitButton: string,
        successMessage: string,
        successMessageContainer: string
    })
};
