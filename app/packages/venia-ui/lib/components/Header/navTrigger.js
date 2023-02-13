import { useNavigationTrigger } from '@magento/peregrine/lib/talons/Header/useNavigationTrigger';
import { node, shape, string } from 'prop-types';
import React from 'react';
import { Menu as MenuIcon } from 'react-feather';
import { useIntl } from 'react-intl';

import { useStyle } from '../../classify';
import Icon from '../Icon';
import defaultClasses from './navTrigger.module.css';

/**
 * A component that toggles the navigation menu.
 */
const NavigationTrigger = props => {
	const { formatMessage } = useIntl();
	const { handleOpenNavigation } = useNavigationTrigger();

	const classes = useStyle(defaultClasses, props.classes);
	return (
		<button
			className={classes.root}
			data-cy="Header-NavigationTrigger-root"
			aria-label={formatMessage({
				id: 'navigationTrigger.ariaLabel',
				defaultMessage: 'Toggle navigation panel'
			})}
			onClick={handleOpenNavigation}
		>
			<Icon src={MenuIcon} />
		</button>
	);
};

NavigationTrigger.propTypes = {
	children: node,
	classes: shape({
		root: string
	})
};

export default NavigationTrigger;
