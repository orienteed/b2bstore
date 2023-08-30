import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './reOrderBtn.module.css';
import buttonClasses from '@magento/venia-ui/lib/components/Button/button.module.css';
import useReOrderItems from '@magento/peregrine/lib/talons/OrderHistoryPage/useReOrderItems.js';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { FormattedMessage } from 'react-intl';

const ReOrder = props => {
    const { orderNumber, order, config } = props;
    const classes = useStyle(defaultClasses, buttonClasses);
    const { addConfigurableProductToCart: addConfigurableProductToCartFromAdapter } = useAdapter();

    const talonPropsForReOrderItems = useReOrderItems({
        order,
        config,
        addConfigurableProductToCartFromAdapter
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
