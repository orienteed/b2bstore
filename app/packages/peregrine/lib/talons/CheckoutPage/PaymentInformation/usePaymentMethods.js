import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

export const usePaymentMethods = props => {
    const { getPaymentMethods } = useAdapter();

    const [{ cartId }] = useCartContext();

    const { data, loading } = getPaymentMethods({ cartId: cartId });

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
