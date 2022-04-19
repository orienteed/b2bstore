import React from 'react';
import { func, number, shape, string } from 'prop-types';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './icon.module.css';

const Icon = props => {
    // destructure `propClasses` to exclude it from `restProps`
    const {
        attrs,
        classes: propClasses,
        size,
        src: Component,
        ...restProps
    } = props;
    const { width, ...restAttrs } = attrs || {};
    const classes = mergeClasses(defaultClasses, propClasses);

    return (
        <span className={classes.root} {...restProps}>
            <Component
                className={classes.icon}
                size={size || width}
                {...restAttrs}
            />
        </span>
    );
};

export default Icon;

Icon.propTypes = {
    attrs: shape({}),
    classes: shape({
        icon: string,
        root: string
    }),
    size: number,
    src: func.isRequired
};