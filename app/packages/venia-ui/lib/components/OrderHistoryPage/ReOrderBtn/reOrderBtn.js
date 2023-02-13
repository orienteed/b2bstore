import useReOrderItems from '@magento/peregrine/lib/talons/OrderHistoryPage/useReOrderItems.js';
import { ADD_CONFIGURABLE_MUTATION } from '@magento/peregrine/lib/talons/ProductFullDetail/productFullDetail.gql.ce';
import { useStyle } from '@magento/venia-ui/lib/classify';
import buttonClasses from '@magento/venia-ui/lib/components/Button/button.module.css';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import defaultClasses from './reOrderBtn.module.css';

const ReOrder = props => {
	const { orderNumber, order, config } = props;
	const classes = useStyle(defaultClasses, buttonClasses);

	const talonPropsForReOrderItems = useReOrderItems({
		order,
		config,
		addConfigurableProductToCartMutation: ADD_CONFIGURABLE_MUTATION
	});
	const { handleReOrderClick, isLoading } = talonPropsForReOrderItems;

	if (isLoading) {
		return fullPageLoadingIndicator;
	}

	return (
		<div className={classes.reOrderDiv}>
			<button
				onClick={() => handleReOrderClick(orderNumber)}
				type="button"
				id={orderNumber}
				className={[classes.reOrderBtn, classes.root].join(' ')}
			>
				<FormattedMessage id={'orderRow.ReOrder'} defaultMessage={'ReOrder'} />
			</button>
		</div>
	);
};

export default ReOrder;
