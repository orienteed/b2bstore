import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { func, shape, string } from 'prop-types';
import { Form } from 'informed';
import { useSignIn } from '@magento/peregrine/lib/talons/SignIn/useSignIn';

import LoadingIndicator from '../LoadingIndicator';
import { useStyle } from '../../classify';
import { isRequired } from '../../util/formValidators';
import Button from '../Button';
import Field from '../Field';
import TextInput from '../TextInput';
import defaultClasses from './signIn.module.css';
import LinkButton from '../LinkButton';
import Password from '../Password';
import FormError from '../FormError/formError';
import GoogleRecaptcha from '../GoogleReCaptcha';

const SignIn = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const {
        initialValues,
        setDefaultUsername,
        showCreateAccount,
        showForgotPassword
    } = props;

    const { formatMessage } = useIntl();
    const talonProps = useSignIn({
        setDefaultUsername,
        showCreateAccount,
        showForgotPassword
    });

    const {
        errors,
        handleCreateAccount,
        handleForgotPassword,
        handleSubmit,
        isBusy,
        isSigningIn,
        recaptchaWidgetProps,
        setFormApi
    } = talonProps;

    if (isSigningIn) {
        return (
            <div className={classes.modal_active}>
                <LoadingIndicator>
                    <FormattedMessage
                        id={'signIn.loadingText'}
                        defaultMessage={'Signing In'}
                    />
                </LoadingIndicator>
            </div>
        );
    }

    const forgotPasswordClasses = {
        root: classes.forgotPasswordButton
    };

    return (
        <div data-cy="SignIn-root" className={classes.root}>
            <span data-cy="SignIn-title" className={classes.title}>
                <FormattedMessage
                    id={'signIn.titleText'}
                    defaultMessage={'Sign-in to Your Account'}
                />
            </span>
            <FormError errors={Array.from(errors.values())} />
            <Form
                getApi={setFormApi}
                className={classes.form}
                onSubmit={handleSubmit}
                data-cy="SignIn-form"
                initialValues={initialValues && initialValues}
            >
                <Field
                    id="email"
                    label={formatMessage({
                        id: 'signIn.emailAddressText',
                        defaultMessage: 'Email address'
                    })}
                >
                    <TextInput
                        id="email"
                        data-cy="SignIn-email"
                        autoComplete="email"
                        field="email"
                        validate={isRequired}
                    />
                </Field>
                <Password
                    data-cy="SignIn-password"
                    fieldName="password"
                    id="Password"
                    label={formatMessage({
                        id: 'signIn.passwordText',
                        defaultMessage: 'Password'
                    })}
                    validate={isRequired}
                    autoComplete="current-password"
                    isToggleButtonHidden={false}
                />
                <div className={classes.forgotPasswordButtonContainer}>
                    <LinkButton
                        classes={forgotPasswordClasses}
                        type="button"
                        onClick={handleForgotPassword}
                        data-cy="SignIn-forgotPasswordButton"
                    >
                        <FormattedMessage
                            id={'signIn.forgotPasswordText'}
                            defaultMessage={'Forgot Password?'}
                        />
                    </LinkButton>
                </div>
                <GoogleRecaptcha {...recaptchaWidgetProps} />
                <div className={classes.buttonsContainer}>
                    <Button
                        priority="high"
                        type="submit"
                        data-cy="SignInButton-root_highPriority"
                        disabled={isBusy}
                    >
                        <FormattedMessage
                            id={'signIn.signInText'}
                            defaultMessage={'Sign In'}
                        />
                    </Button>
                    <Button
                        priority="normal"
                        type="button"
                        onClick={handleCreateAccount}
                        data-cy="CreateAccount-initiateButton"
                    >
                        <FormattedMessage
                            id={'signIn.createAccountText'}
                            defaultMessage={'Create an Account'}
                        />
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default SignIn;
SignIn.propTypes = {
    classes: shape({
        buttonsContainer: string,
        form: string,
        forgotPasswordButton: string,
        forgotPasswordButtonContainer: string,
        root: string,
        title: string
    }),
    setDefaultUsername: func,
    showCreateAccount: func,
    showForgotPassword: func,
    initialValues: shape({
        email: string.isRequired
    })
};
SignIn.defaultProps = {
    setDefaultUsername: () => {},
    showCreateAccount: () => {},
    showForgotPassword: () => {}
};
