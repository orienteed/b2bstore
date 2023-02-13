import { number, shape, string } from 'prop-types';
import React from 'react';
import { Star } from 'react-feather';

import { useStyle } from '../../classify';
import Icon from '../Icon';
import defaultClasses from './rating.module.css';

const Rating = props => {
	const { rating } = props;

	const classes = useStyle(defaultClasses, props.classes);

	return (
		<div className={classes.ratingAverage} data-cy="ratingSummary">
			<span className={classes.ratingValue}>{((rating * 5) / 100).toFixed(1)}</span>{' '}
			<Icon size={18} src={Star} classes={{ root: classes.ratingIcon }} />
		</div>
	);
};
Rating.propTypes = {
	classes: shape({
		ratingAverage: string,
		ratingValue: string,
		ratingIcon: string
	}),
	rating: number.isRequired
};
export default Rating;
