import { useCreditCard } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useCreditCard';
import { bool, func, shape, string } from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { useStyle } from '../../../classify';
import { isRequired } from '../../../util/formValidators';
import Country from '../../Country';
import Field from '../../Field';
import FormError from '../../FormError';
import GoogleReCaptcha from '../../GoogleReCaptcha';
import LoadingIndicator from '../../LoadingIndicator';
import Postcode from '../../Postcode';
import Region from '../../Region';
import TextInput from '../../TextInput';
import BrainTreeDropin from './brainTreeDropIn';
import defaultClasses from './creditCard.module.css';

const STEP_DESCRIPTIONS = [
	{ defaultMessage: 'Loading Payment', id: 'checkoutPage.step0' },
	{
		defaultMessage: 'Checking Credit Card Information',
		id: 'checkoutPage.step1'
	},
	{
		defaultMessage: 'Checking Credit Card Information',
		id: 'checkoutPage.step2'
	},
	{
		defaultMessage: 'Checking Credit Card Information',
		id: 'checkoutPage.step3'
	},
	{
		defaultMessage: 'Saved Credit Card Information Successfully',
		id: 'checkoutPage.step4'
	}
];

const CreditCard = props => {
	const {
		classes: propClasses,
		onPaymentSuccess: onSuccess,
		onDropinReady: onReady,
		onPaymentError: onError,
		resetShouldSubmit,
		shouldSubmit
	} = props;
	const { formatMessage } = useIntl();

	const classes = useStyle(defaultClasses, propClasses);

	const talonProps = useCreditCard({
		onSuccess,
		onReady,
		onError,
		shouldSubmit,
		resetShouldSubmit
	});

	const {
		errors,
		shouldRequestPaymentNonce,
		onPaymentError,
		onPaymentSuccess,
		onPaymentReady,
		isBillingAddressDefault,
		isLoading,
		/**
		 * `stepNumber` depicts the state of the process flow in credit card
		 * payment flow.
		 *
		 * `0` No call made yet
		 * `1` Billing address mutation intiated
		 * `2` Braintree nonce requsted
		 * `3` Payment information mutation intiated
		 * `4` All mutations done
		 */
		stepNumber,
		initialValues,
		shippingAddressCountry,
		shouldTeardownDropin,
		resetShouldTeardownDropin,
		recaptchaWidgetProps
	} = talonProps;

	const creditCardComponentClassName = isLoading ? classes.credit_card_root_hidden : classes.credit_card_root;

	const billingAddressFieldsClassName = isBillingAddressDefault
		? classes.billing_address_fields_root_hidden
		: classes.billing_address_fields_root;

	/**
	 * Instead of defining classes={root: classes.FIELD_NAME}
	 * we are using useMemo to only do it once (hopefully).
	 */
	const fieldClasses = useMemo(() => {
		return [
			'first_name',
			'last_name',
			'country',
			'street1',
			'street2',
			'city',
			'region',
			'postal_code',
			'phone_number'
		].reduce((acc, fieldName) => {
			acc[fieldName] = { root: classes[fieldName] };

			return acc;
		}, {});
	}, [classes]);

	/**
	 * These 2 functions are wrappers around the `isRequired` function
	 * of `formValidators`. They perform validations only if the
	 * billing address is different from shipping address.
	 *
	 * We write this function in `venia-ui` and not in the `peregrine` talon
	 * because it references `isRequired` which is a `venia-ui` function.
	 */
	const isFieldRequired = useCallback((value, { isBillingAddressDefault }) => {
		if (isBillingAddressDefault) {
			/**
			 * Informed validator functions return `undefined` if
			 * validation is `true`
			 */
			return undefined;
		} else {
			return isRequired(value);
		}
	}, []);

	const stepTitle = STEP_DESCRIPTIONS[stepNumber].defaultMessage
		? formatMessage({
				id: STEP_DESCRIPTIONS[stepNumber].id,
				defaultMessage: STEP_DESCRIPTIONS[stepNumber].defaultMessage
		  })
		: formatMessage({
				id: 'checkoutPage.loadingPayment',
				defaultMessage: 'Loading Payment'
		  });

	const loadingIndicator = isLoading ? <LoadingIndicator>{stepTitle}</LoadingIndicator> : null;

	const isBillingAddressDefaultHtml = useMemo(() => {
		if (initialValues.isBillingAddressDefault) {
			return (
				<h2 className={classes.address_check}>
					<FormattedMessage
						id={'checkoutPage.billingAddressDefault'}
						defaultMessage={'Your default billing address will be used for this order'}
					/>
				</h2>
			);
		}
		return null;
	}, [initialValues]);

	return (
		<div className={classes.root}>
			<div className={creditCardComponentClassName}>
				<FormError classes={{ root: classes.formErrorContainer }} errors={Array.from(errors.values())} />
				<div className={classes.dropin_root}>
					<BrainTreeDropin
						onError={onPaymentError}
						onReady={onPaymentReady}
						onSuccess={onPaymentSuccess}
						shouldRequestPaymentNonce={shouldRequestPaymentNonce}
						shouldTeardownDropin={shouldTeardownDropin}
						resetShouldTeardownDropin={resetShouldTeardownDropin}
					/>
				</div>
				{isBillingAddressDefaultHtml}
				<div className={billingAddressFieldsClassName}>
					<Field
						id="firstName"
						classes={fieldClasses.first_name}
						label={formatMessage({
							id: 'global.firstName',
							defaultMessage: 'First Name'
						})}
					>
						<TextInput
							id="firstName"
							field="firstName"
							validate={isFieldRequired}
							initialValue={initialValues.firstName}
						/>
					</Field>
					<Field
						id="lastName"
						classes={fieldClasses.last_name}
						label={formatMessage({
							id: 'global.lastName',
							defaultMessage: 'Last Name'
						})}
					>
						<TextInput
							id="lastName"
							field="lastName"
							validate={isFieldRequired}
							initialValue={initialValues.lastName}
						/>
					</Field>
					<Country
						classes={fieldClasses.country}
						validate={isFieldRequired}
						initialValue={
							/**
							 * If there is no initial value to start with
							 * use the country from shipping address.
							 */
							initialValues.country || shippingAddressCountry
						}
					/>
					<Field
						id="street1"
						classes={fieldClasses.street1}
						label={formatMessage({
							id: 'global.streetAddress',
							defaultMessage: 'Street Address'
						})}
					>
						<TextInput
							id="street1"
							field="street1"
							validate={isFieldRequired}
							initialValue={initialValues.street1}
						/>
					</Field>
					<Field
						id="street2"
						classes={fieldClasses.street2}
						label={formatMessage({
							id: 'global.streetAddress2',
							defaultMessage: 'Street Address 2'
						})}
						optional={true}
					>
						<TextInput id="street2" field="street2" initialValue={initialValues.street2} />
					</Field>
					<Field
						id="city"
						classes={fieldClasses.city}
						label={formatMessage({
							id: 'global.city',
							defaultMessage: 'City'
						})}
					>
						<TextInput
							id="city"
							field="city"
							validate={isFieldRequired}
							initialValue={initialValues.city}
						/>
					</Field>
					<Region
						classes={fieldClasses.region}
						initialValue={initialValues.region}
						validate={isFieldRequired}
					/>
					<Postcode
						classes={fieldClasses.postal_code}
						validate={isFieldRequired}
						initialValue={initialValues.postcode}
					/>
					<Field
						id="phoneNumber"
						classes={fieldClasses.phone_number}
						label={formatMessage({
							id: 'global.phoneNumber',
							defaultMessage: 'Phone Number'
						})}
					>
						<TextInput
							id="phoneNumber"
							field="phoneNumber"
							validate={isFieldRequired}
							initialValue={initialValues.phoneNumber}
						/>
					</Field>
				</div>
				<GoogleReCaptcha {...recaptchaWidgetProps} />
			</div>
			{loadingIndicator}
		</div>
	);
};

export default CreditCard;

CreditCard.propTypes = {
	classes: shape({
		root: string,
		dropin_root: string,
		billing_address_fields_root: string,
		first_name: string,
		last_name: string,
		city: string,
		region: string,
		postal_code: string,
		phone_number: string,
		country: string,
		street1: string,
		street2: string,
		address_check: string,
		credit_card_root: string,
		credit_card_root_hidden: string
	}),
	shouldSubmit: bool.isRequired,
	onPaymentSuccess: func,
	onDropinReady: func,
	onPaymentError: func,
	resetShouldSubmit: func.isRequired
};
