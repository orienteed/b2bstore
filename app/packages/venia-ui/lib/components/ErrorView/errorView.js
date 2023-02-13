import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import { func, shape, string } from 'prop-types';
import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';

import defaultClasses from './errorView.module.css';

const DEFAULT_HEADER = 'Oops!';
const DEFAULT_MESSAGE = 'Looks like something went wrong. Contact the administration for more information.';
const DEFAULT_PROMPT = 'Take me home';

const ErrorView = props => {
	const classes = useStyle(defaultClasses, props.classes);
	const history = useHistory();

	const handleGoHome = useCallback(() => {
		history.push('/');
	}, [history]);

	const {
		header = <FormattedMessage id={'errorView.header'} defaultMessage={DEFAULT_HEADER} />,
		message = <FormattedMessage id={'errorView.message'} defaultMessage={DEFAULT_MESSAGE} />,
		buttonPrompt = <FormattedMessage id={'errorView.goHome'} defaultMessage={DEFAULT_PROMPT} />,
		onClick = handleGoHome
	} = props;

	const handleClick = useCallback(() => {
		onClick && onClick();
	}, [onClick]);

	return (
		<div className={classes.root}>
			<div className={classes.content}>
				<p className={classes.header}>{header}</p>
				<p className={classes.message} data-cy="ErrorView-message">
					{message}
				</p>
				<div className={classes.actionsContainer}>
					<Button priority="high" type="button" onClick={handleClick}>
						{buttonPrompt}
					</Button>
				</div>
			</div>
		</div>
	);
};

ErrorView.propTypes = {
	header: string,
	message: string,
	buttonPrompt: string,
	onClick: func,
	classes: shape({
		root: string,
		content: string,
		errorCode: string,
		header: string,
		message: string,
		actionsContainer: string
	})
};

export default ErrorView;
