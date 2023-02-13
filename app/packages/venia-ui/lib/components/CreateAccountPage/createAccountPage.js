import { useCreateAccountPage } from '@magento/peregrine/lib/talons/CreateAccountPage/useCreateAccountPage';
import { useStyle } from '@magento/venia-ui/lib/classify';
import CreateAccount from '@magento/venia-ui/lib/components/CreateAccount';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import { shape, string } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import defaultClasses from './createAccountPage.module.css';

const CreateAccountPage = props => {
	const classes = useStyle(defaultClasses, props.classes);
	const { createAccountProps } = useCreateAccountPage(props);
	const { formatMessage } = useIntl();

	return (
		<div className={classes.root}>
			<StoreTitle>
				{formatMessage({
					id: 'createAccountPage.title',
					defaultMessage: 'Create an Account'
				})}
			</StoreTitle>
			<div className={classes.contentContainer}>
				<CreateAccount {...createAccountProps} />
			</div>
		</div>
	);
};

CreateAccountPage.defaultProps = {
	signedInRedirectUrl: '/',
	signInPageUrl: '/sign-in'
};

CreateAccountPage.propTypes = {
	classes: shape({
		root: string,
		header: string,
		contentContainer: string
	}),
	signedInRedirectUrl: string,
	signInPageUrl: string
};

export default CreateAccountPage;
