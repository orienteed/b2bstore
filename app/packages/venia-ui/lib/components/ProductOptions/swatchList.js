import { arrayOf, func, object, shape, string } from 'prop-types';
import React, { useMemo } from 'react';

import { useStyle } from '../../classify';
import Swatch from './swatch';
import defaultClasses from './swatchList.module.css';

const SwatchList = props => {
	const {
		getItemKey,
		selectedValue = {},
		items,
		onSelectionChange,
		isEverythingOutOfStock,
		outOfStockVariants
	} = props;

	const classes = useStyle(defaultClasses, props.classes);
	const swatches = useMemo(
		() =>
			items.map(item => {
				const isSelected = item.label === selectedValue.label;
				let isOptionOutOfStock;
				if (outOfStockVariants && outOfStockVariants.length > 0) {
					const flatOutOfStockArray = outOfStockVariants.flat();
					isOptionOutOfStock = flatOutOfStockArray.includes(item.value_index);
				}
				return (
					<Swatch
						key={getItemKey(item)}
						isSelected={isSelected}
						item={item}
						onClick={onSelectionChange}
						isEverythingOutOfStock={isEverythingOutOfStock}
						isOptionOutOfStock={isOptionOutOfStock}
					/>
				);
			}),
		[getItemKey, selectedValue.label, items, onSelectionChange, isEverythingOutOfStock, outOfStockVariants]
	);

	return <div className={classes.root}>{swatches}</div>;
};

SwatchList.propTypes = {
	classes: shape({
		root: string
	}),
	getItemKey: func,
	selectedValue: object,
	items: arrayOf(object),
	onSelectionChange: func
};

SwatchList.displayName = 'SwatchList';

export default SwatchList;
