import React, { useRef } from 'react';
import { element, func, shape, string } from 'prop-types';
import { Heart } from 'react-feather';
import { useDeleteToListButton } from '../../../talons/WishList/DeleteToListButton/useDeleteToListButton.js';
import { useButton } from 'react-aria';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '../../Icon';
import defaultClasses from './deleteToListButton.module.css';
import { useCommonToasts } from '@magento/venia-ui/lib/components/Wishlist/AddToListButton/useCommonToasts.js';

const HeartIcon = <Icon size={20} src={Heart} />;

const DeleteToListButton = props => {
    const talonProps = useDeleteToListButton(props);
    const buttonRef = useRef();

    const {
        buttonProps,
        buttonText,
        errorToastProps,
        isSelectedRemove,
        loginToastProps,
        successToastProps
    } = talonProps;

    useCommonToasts({ errorToastProps, loginToastProps, successToastProps });
    const { buttonProps: ariaButtonProps } = useButton(buttonProps, buttonRef);

    const classes = useStyle(defaultClasses, props.classes);
    const buttonClass = isSelectedRemove ? classes.root_selected : classes.root;

    return (
        <button ref={buttonRef} className={buttonClass} {...ariaButtonProps}>
            {props.icon} {buttonText}
        </button>
    );
};

export default DeleteToListButton;

DeleteToListButton.defaultProps = {
    icon: HeartIcon
};

DeleteToListButton.propTypes = {
    afterRemove: func,
    beforeRemove: func,
    classes: shape({
        root: string,
        root_selected: string
    }),
    icon: element
};
