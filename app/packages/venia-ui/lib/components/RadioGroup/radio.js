import { Radio as InformedRadio } from 'informed';
import { node, shape, string } from 'prop-types';
import React from 'react';
import { Circle } from 'react-feather';

import { useStyle } from '../../classify';
import defaultClasses from './radio.module.css';

/* TODO: change lint config to use `label-has-associated-control` */

const RadioOption = props => {
	const { ariaLabel, classes: propClasses, id, label, value, ...rest } = props;
	const classes = useStyle(defaultClasses, propClasses);

	return (
		<label className={classes.root} htmlFor={id} aria-label={ariaLabel ? ariaLabel : ''}>
			<InformedRadio {...rest} className={classes.input} id={id} value={value} />
			<span className={classes.icon}>
				<Circle />
			</span>
			<span className={classes.label}>{label || (value != null ? value : '')}</span>
		</label>
	);
};

export default RadioOption;

RadioOption.propTypes = {
	ariaLabel: string,
	classes: shape({
		icon: string,
		input: string,
		label: string,
		root: string
	}),
	id: string.isRequired,
	label: node.isRequired,
	value: node.isRequired
};
