import { useContactLink } from '@magento/peregrine/lib/talons/ContactPage';
import React from 'react';

import Shimmer from '../Shimmer';

const ContactLink = props => {
	const { children } = props;
	const talonProps = useContactLink();
	const { isEnabled, isLoading } = talonProps;

	if (!isEnabled && !isLoading) {
		return null;
	}

	if (isLoading) {
		return <Shimmer />;
	}

	return children;
};

export default ContactLink;
