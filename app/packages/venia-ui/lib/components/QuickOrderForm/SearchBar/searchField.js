import { useStyle } from '@magento/venia-ui/lib/classify';
import { func } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import defaultClasses from './searchField.module.css';

const SearchField = props => {
	const classes = useStyle(defaultClasses);
	const { onChange, quickOrder, value, ...rest } = props;
	const { formatMessage } = useIntl();

	return (
		<div className={defaultClasses.searchField}>
			<input
				onChange={e => onChange(e.target.value)}
				placeholder={formatMessage({
					id: 'quickOrder.SearchProduct',
					defaultMessage: 'Enter SKU or name of product'
				})}
				value={value}
				{...rest}
				className={`${classes.input} ${quickOrder && defaultClasses.inputQty}`}
			/>
		</div>
	);
};

export default SearchField;

SearchField.propTypes = {
	onChange: func,
	onFocus: func
};
