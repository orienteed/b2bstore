import { useAddToListButton } from '@magento/peregrine/lib/talons/Wishlist/AddToListButton/useAddToListButton';
import { element, func, shape, string } from 'prop-types';
import React, { useRef } from 'react';
import { useButton } from 'react-aria';
import { Star } from 'react-feather';

import { useStyle } from '../../../classify';
import Icon from '../../Icon';
import defaultClasses from './addToListButton.module.css';
import { useCommonToasts } from './useCommonToasts';

const StarIcon = <Icon size={20} src={Star} />;

const AddToListButton = props => {
	const talonProps = useAddToListButton(props);
	const buttonRef = useRef();

	const { buttonProps, buttonText, errorToastProps, isSelected, loginToastProps, successToastProps } = talonProps;

	useCommonToasts({ errorToastProps, loginToastProps, successToastProps });
	const { buttonProps: ariaButtonProps } = useButton(buttonProps, buttonRef);

	const classes = useStyle(defaultClasses, props.classes);
	const buttonClass = isSelected ? classes.root_selected : classes.root;

	return (
		<button ref={buttonRef} className={buttonClass} {...ariaButtonProps}>
			{props.icon} {buttonText}
		</button>
	);
};

export default AddToListButton;

AddToListButton.defaultProps = {
	icon: StarIcon
};

AddToListButton.propTypes = {
	afterAdd: func,
	beforeAdd: func,
	classes: shape({
		root: string,
		root_selected: string
	}),
	icon: element
};
