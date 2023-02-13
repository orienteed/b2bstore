import { useQuery } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './paymentMethods.gql';

export const usePaymentMethods = props => {
	const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
	const { getPaymentMethodsQuery } = operations;

	const [{ cartId }] = useCartContext();

	const { data, loading } = useQuery(getPaymentMethodsQuery, {
		skip: !cartId,
		variables: { cartId }
	});

	const { value: currentSelectedPaymentMethod } = useFieldState('selectedPaymentMethod');

	const availablePaymentMethods = (data && data.cart.available_payment_methods) || [];

	const initialSelectedMethod = null;

	return {
		availablePaymentMethods,
		currentSelectedPaymentMethod,
		initialSelectedMethod,
		isLoading: loading
	};
};
