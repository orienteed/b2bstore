import { useFilterModal } from '@magento/peregrine/lib/talons/FilterModal';
import { array, shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '../../classify';
import Button from '../Button';
import defaultClasses from './filterModalOpenButton.module.css';

const FilterModalOpenButton = props => {
	const { filters, classes: propsClasses } = props;
	const classes = useStyle(defaultClasses, propsClasses);
	const { handleOpen } = useFilterModal({ filters });

	return (
		<Button
			priority={'low'}
			classes={{
				root_lowPriority: classes.filterButton
			}}
			data-cy="FilterModalOpenButton-button"
			onClick={handleOpen}
			type="button"
			aria-live="polite"
			aria-busy="false"
		>
			<FormattedMessage id={'productList.filter'} defaultMessage={'Filter'} />
		</Button>
	);
};

export default FilterModalOpenButton;

FilterModalOpenButton.propTypes = {
	classes: shape({
		filterButton: string
	}),
	filters: array
};
