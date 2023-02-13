import { func } from 'prop-types';
import React, { Suspense } from 'react';
import { useIntl } from 'react-intl';

import { useStyle } from '../../../classify';
import { Accordion, Section } from '../../Accordion';
import CouponCode from '../../CartPage/PriceAdjustments/CouponCode';
import GiftCardSection from '../../CartPage/PriceAdjustments/giftCardSection';
import GiftOptionsSection from '../../CartPage/PriceAdjustments/giftOptionsSection';
import LoadingIndicator from '../../LoadingIndicator';
import defaultClasses from './priceAdjustments.module.css';

/**
 * PriceAdjustments component for the Checkout page.

 * @param {Function} props.setPageIsUpdating callback that sets checkout page updating state
 */
const PriceAdjustments = props => {
	const classes = useStyle(defaultClasses, props.classes);

	const { setPageIsUpdating } = props;
	const { formatMessage } = useIntl();

	return (
		<div className={classes.root}>
			<Accordion canOpenMultiple={true}>
				<Section
					data-cy="PriceAdjustments-couponCodeSection"
					id={'coupon_code'}
					title={formatMessage({
						id: 'checkoutPage.couponCode',
						defaultMessage: 'Enter Coupon Code'
					})}
				>
					<Suspense fallback={<LoadingIndicator />}>
						<CouponCode setIsCartUpdating={setPageIsUpdating} />
					</Suspense>
				</Section>
				<GiftCardSection setIsCartUpdating={setPageIsUpdating} />
				<GiftOptionsSection />
			</Accordion>
		</div>
	);
};

export default PriceAdjustments;

PriceAdjustments.propTypes = {
	setPageIsUpdating: func
};
