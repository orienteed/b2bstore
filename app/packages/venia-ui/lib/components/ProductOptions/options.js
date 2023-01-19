import React, { useEffect } from 'react';
import { array, func } from 'prop-types';

import Option from './option';
import { useOptions } from '@magento/peregrine/lib/talons/ProductOptions/useOptions';

const Options = props => {
    const {
        classes,
        onSelectionChange,
        options,
        selectedValues = [],
        isEverythingOutOfStock,
        outOfStockVariants,
        selected
    } = props;

    const talonProps = useOptions({
        onSelectionChange,
        selectedValues,
        options
    });

    const { handleSelectionChange, selectedValueMap } = talonProps;

    const ATTRIBUTE_ID = options[0].attribute_id;
    const VALUE_INDEX = options[0].values[0].value_index;

    useEffect(() => {
        handleSelectionChange(ATTRIBUTE_ID, VALUE_INDEX);
    }, []);
    // Render a list of options passing in any pre-selected values.
    return options.map(option => (
        <Option
            {...option}
            classes={classes}
            key={option.attribute_id}
            onSelectionChange={handleSelectionChange}
            selectedValue={selectedValueMap.get(option.label)}
            isEverythingOutOfStock={isEverythingOutOfStock}
            outOfStockVariants={outOfStockVariants}
            attribute_id={option.attribute_id}
            selectedValues={selected}
        />
    ));
};

Options.propTypes = {
    onSelectionChange: func,
    options: array.isRequired,
    selectedValues: array
};

export default Options;
