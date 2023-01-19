import React from 'react';
import { bool, func, number, oneOfType, shape, string } from 'prop-types';

import { useStyle } from '../../classify';
import defaultClasses from './tile.module.css';
import { useTile } from '@magento/peregrine/lib/talons/ProductOptions/useTile';

const getClassName = (
    name,
    isSelected,
    hasFocus,
    isOptionOutOfStock,
    isEverythingOutOfStock,
    attribute_id,
    maxSelectedKey
) =>
    `${name}${isSelected ? '_selected' : ''}${hasFocus ? '_focused' : ''}${
        attribute_id > maxSelectedKey && (isEverythingOutOfStock || isOptionOutOfStock) ? '_outOfStock' : ''
    }`;

const Tile = props => {
    const {
        hasFocus,
        isSelected,
        item: { label, value_index },
        onClick,
        isEverythingOutOfStock,
        isOptionOutOfStock,
        selectedValues,
        attribute_id
    } = props;
    const selectedKeys = [...selectedValues?.entries()]
        .filter(([, value]) => value !== undefined)
        .map(([key]) => Number(key));
    let maxSelectedKey;
    if (selectedKeys.length > 0) maxSelectedKey = Math.max(...selectedKeys);
    console.log({ maxSelectedKey, attribute_id });

    const talonProps = useTile({
        onClick,
        value_index
    });

    const { handleClick } = talonProps;
    const classes = useStyle(defaultClasses, props.classes);
    const className =
        classes[
            getClassName(
                'root',
                isSelected,
                hasFocus,
                isOptionOutOfStock,
                isEverythingOutOfStock,
                attribute_id,
                maxSelectedKey
            )
        ];

    return (
        <button
            className={className}
            onClick={handleClick}
            title={label}
            type="button"
            data-cy="Tile-button"
            disabled={attribute_id > maxSelectedKey && (isEverythingOutOfStock || isOptionOutOfStock)}
        >
            <span>{label}</span>
        </button>
    );
};

export default Tile;

Tile.propTypes = {
    hasFocus: bool,
    isSelected: bool,
    item: shape({
        label: string.isRequired,
        value_index: oneOfType([number, string]).isRequired
    }).isRequired,
    onClick: func.isRequired
};

Tile.defaultProps = {
    hasFocus: false,
    isSelected: false
};
