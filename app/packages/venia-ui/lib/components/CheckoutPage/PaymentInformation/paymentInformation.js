import CheckoutError from '@magento/peregrine/lib/talons/CheckoutPage/CheckoutError';
import { usePaymentInformation } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/usePaymentInformation';
import { Form } from 'informed';
import { bool, func, instanceOf, shape, string } from 'prop-types';
import React, { Suspense } from 'react';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '../../../classify';
import LoadingIndicator from '../../LoadingIndicator';
import defaultClasses from './paymentInformation.module.css';

const PaymentMethods = React.lazy(() => import('./paymentMethods'));
const EditModal = React.lazy(() => import('./editModal'));
const Summary = React.lazy(() => import('./summary'));

const PaymentInformation = props => {
	const {
		classes: propClasses,
		onSave,
		resetShouldSubmit,
		setCheckoutStep,
		shouldSubmit,
		checkoutError,
		setCurrentSelectedPaymentMethod,
		paymentMethodMutationData
	} = props;

	const classes = useStyle(defaultClasses, propClasses);

	const talonProps = usePaymentInformation({
		onSave,
		checkoutError,
		resetShouldSubmit,
		setCheckoutStep,
		shouldSubmit
	});

	const {
		doneEditing,
		handlePaymentError,
		handlePaymentSuccess,
		hideEditModal,
		isLoading,
		isEditModalActive,
		showEditModal
	} = talonProps;

	if (isLoading) {
		return (
			<LoadingIndicator classes={{ root: classes.loading }}>
				<FormattedMessage
					id={'checkoutPage.loadingPaymentInformation'}
					defaultMessage={'Fetching Payment Information'}
				/>
			</LoadingIndicator>
		);
	}

	const paymentInformation = doneEditing ? (
		<Summary onEdit={showEditModal} />
	) : (
		<Form>
			<PaymentMethods
				setCurrentSelectedPaymentMethod={setCurrentSelectedPaymentMethod}
				onPaymentError={handlePaymentError}
				onPaymentSuccess={handlePaymentSuccess}
				resetShouldSubmit={resetShouldSubmit}
				shouldSubmit={shouldSubmit}
				paymentMethodMutationData={paymentMethodMutationData}
			/>
		</Form>
	);

	const editModal = doneEditing ? (
		<Suspense fallback={null}>
			<EditModal onClose={hideEditModal} isOpen={isEditModalActive} />
		</Suspense>
	) : null;

	return (
		<div className={classes.root} data-cy="PaymentInformation-root">
			<div className={classes.payment_info_container}>
				<Suspense fallback={null}>{paymentInformation}</Suspense>
			</div>
			{editModal}
		</div>
	);
};

export default PaymentInformation;

PaymentInformation.propTypes = {
	classes: shape({
		container: string,
		payment_info_container: string,
		review_order_button: string
	}),
	onSave: func.isRequired,
	checkoutError: instanceOf(CheckoutError),
	resetShouldSubmit: func.isRequired,
	shouldSubmit: bool
};
