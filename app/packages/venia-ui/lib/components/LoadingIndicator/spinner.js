import React from 'react';
import { RotateCw as LoaderIcon } from 'react-feather';

import { useStyle } from '../../classify';
import Icon from '../Icon';
import defaultClasses from './spinner.module.css';

const Spinner = props => {
	const classes = useStyle(defaultClasses, props.classes);

	return <Icon src={LoaderIcon} size={24} classes={{ root: classes.root, icon: classes.icon }} />;
};

export default Spinner;
