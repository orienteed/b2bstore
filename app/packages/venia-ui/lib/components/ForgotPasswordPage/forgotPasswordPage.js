import { useForgotPasswordPage } from '@magento/peregrine/lib/talons/ForgotPasswordPage/useForgotPasswordPage';
import { useStyle } from '@magento/venia-ui/lib/classify';
import ForgotPassword from '@magento/venia-ui/lib/components/ForgotPassword';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import { shape, string } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import defaultClasses from './forgotPasswordPage.module.css';

const ForgotPasswordPage = props => {
	const classes = useStyle(defaultClasses, props.classes);
	const { forgotPasswordProps } = useForgotPasswordPage(props);
	const { formatMessage } = useIntl();

	return (
		<div className={classes.root}>
			<StoreTitle>
				{formatMessage({
					id: 'forgotPasswordPage.title',
					defaultMessage: 'Forgot Your Password?'
				})}
			</StoreTitle>
			<div className={classes.contentContainer}>
				<ForgotPassword {...forgotPasswordProps} />
			</div>
		</div>
	);
};

ForgotPasswordPage.defaultProps = {
	signedInRedirectUrl: '/order-history',
	signInPageUrl: '/sign-in'
};

ForgotPasswordPage.propTypes = {
	classes: shape({
		root: string,
		header: string,
		contentContainer: string
	}),
	signedInRedirectUrl: string,
	signInPageUrl: string
};

export default ForgotPasswordPage;
