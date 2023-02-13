import { shape, string } from 'prop-types';
import React, { Fragment } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { useStyle } from '../../classify';
import combine from '../../util/combineValidators';
import { hasLengthAtLeast, isNotEqualToField, isRequired, validatePassword } from '../../util/formValidators';
import Field from '../Field';
import LinkButton from '../LinkButton';
import Password from '../Password';
import TextInput from '../TextInput';
import defaultClasses from './editForm.module.css';

const EditForm = props => {
	const { classes: propClasses, handleChangePassword, shouldShowNewPassword } = props;
	const { formatMessage } = useIntl();

	const classes = useStyle(defaultClasses, propClasses);

	const maybeNewPasswordField = shouldShowNewPassword ? (
		<div className={classes.newPassword}>
			<Password
				fieldName="newPassword"
				label={formatMessage({
					id: 'global.newPassword',
					defaultMessage: 'New Password'
				})}
				validate={combine([
					isRequired,
					[hasLengthAtLeast, 8],
					validatePassword,
					[isNotEqualToField, 'password']
				])}
				isToggleButtonHidden={false}
				data-cy="newPassword"
			/>
		</div>
	) : null;

	const maybeChangePasswordButton = !shouldShowNewPassword ? (
		<div className={classes.changePasswordButtonContainer} data-cy="editForm-changePasswordButtonContainer">
			<LinkButton
				classes={classes.changePasswordButton}
				type="button"
				onClick={handleChangePassword}
				data-cy="linkButton-root"
			>
				<FormattedMessage id={'global.changePassword'} defaultMessage={'Change Password'} />
			</LinkButton>
		</div>
	) : null;

	const passwordLabel = shouldShowNewPassword
		? formatMessage({
				id: 'global.currentPassword',
				defaultMessage: 'Current Password'
		  })
		: formatMessage({
				id: 'global.password',
				defaultMessage: 'Password'
		  });
	return (
		<Fragment>
			<div className={classes.root}>
				<div className={classes.firstname}>
					<Field
						id="firstname"
						label={formatMessage({
							id: 'global.companyName',
							defaultMessage: 'Company Name'
						})}
					>
						<TextInput field="firstname" validate={isRequired} data-cy="firstname" />
					</Field>
				</div>
				<div className={classes.email}>
					<Field
						id="email"
						label={formatMessage({
							id: 'global.email',
							defaultMessage: 'Email'
						})}
					>
						<TextInput field="email" validate={isRequired} data-cy="email" />
					</Field>
				</div>
				<div className={classes.password}>
					<Password
						fieldName="password"
						label={passwordLabel}
						validate={isRequired}
						autoComplete="current-password"
						isToggleButtonHidden={false}
						data-cy="password"
					/>
				</div>
				{maybeNewPasswordField}
				<div className={classes.taxvat}>
					<Field
						label={formatMessage({
							id: 'global.taxVatId',
							defaultMessage: 'Tax/Vat Id'
						})}
					>
						<TextInput field="taxvat" validate={isRequired} data-cy="taxvat" º autocomplete="off" />
					</Field>
				</div>
			</div>
			{maybeChangePasswordButton}
		</Fragment>
	);
};

export default EditForm;

EditForm.propTypes = {
	classes: shape({
		changePasswordButton: string,
		changePasswordButtonContainer: string,
		root: string,
		field: string,
		email: string,
		firstname: string,
		lastname: string,
		buttons: string,
		passwordLabel: string,
		password: string,
		newPassword: string
	})
};
