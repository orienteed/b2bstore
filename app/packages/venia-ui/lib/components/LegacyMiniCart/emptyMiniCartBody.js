import { useEmptyMiniCart } from '@magento/peregrine/lib/talons/LegacyMiniCart/useEmptyMiniCart';
import { func, shape, string } from 'prop-types';
import React from 'react';

import { useStyle } from '../../classify';
import Button from '../Button';
import defaultClasses from './emptyMiniCartBody.module.css';

const EMPTY_TITLE = 'There are no items in your shopping cart';
const CONTINUE_SHOPPING = 'Continue Shopping';
const EmptyMiniCart = props => {
	const { closeDrawer } = props;

	const talonProps = useEmptyMiniCart({
		closeDrawer
	});

	const { handleClick } = talonProps;

	const classes = useStyle(defaultClasses, props.classes);

	return (
		<div className={classes.root}>
			<h3 className={classes.emptyTitle}>{EMPTY_TITLE}</h3>
			<Button priority={'normal'} type={'button'} onClick={handleClick}>
				{CONTINUE_SHOPPING}
			</Button>
		</div>
	);
};

EmptyMiniCart.propTypes = {
	classes: shape({
		root: string,
		emptyTitle: string,
		continue: string
	}),
	closeDrawer: func
};

export default EmptyMiniCart;
