import React, { useRef } from 'react';
import { element, func, shape, string } from 'prop-types';
import { useAddToListButton } from '@magento/peregrine/lib/talons/Wishlist/AddToListButton/useAddToListButton';
import { useButton } from 'react-aria';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from '@magento/venia-ui/lib/components/Wishlist/AddToListButton/addToListButton.module.css';
import { useCommonToasts } from '@magento/venia-ui/lib/components/Wishlist/AddToListButton/useCommonToasts';

import Star from './Icon/star.svg';
import FillStar from './Icon/fillStar.svg';
const StarIcon = <img size={20} src={Star} />;
const StarFillIcon = <img size={20} src={FillStar} />;

const AddToListButton = props => {
    const talonProps = useAddToListButton(props);
    const buttonRef = useRef();

    const { buttonProps, buttonText, errorToastProps, isSelected, loginToastProps, successToastProps } = talonProps;

    useCommonToasts({ errorToastProps, loginToastProps, successToastProps });
    const { buttonProps: ariaButtonProps } = useButton(buttonProps, buttonRef);

    const classes = useStyle(defaultClasses, props.classes);
    const buttonIcon = isSelected ? StarFillIcon : StarIcon;

    return (
        <button ref={buttonRef} {...ariaButtonProps}>
            {props.icon || buttonIcon} {buttonText}
        </button>
    );
};

export default AddToListButton;

AddToListButton.propTypes = {
    afterAdd: func,
    beforeAdd: func,
    classes: shape({
        root: string,
        root_selected: string
    }),
    icon: element
};
