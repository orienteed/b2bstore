import { useCartContext } from '../../../context/cart';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

/**
 * Talon to handle summary component in payment information section of
 * the checkout page.
 *
 * @returns {
 *   isLoading: Boolean,
 *   selectedPaymentMethod: {
 *      code: String,
 *      title: String
 *   }
 * }
 */

export const useSummary = () => {
    const { getSelectedPaymentMethod } = useAdapter();

    const [{ cartId }] = useCartContext();

    const { data: summaryData, loading: summaryDataLoading } = getSelectedPaymentMethod({ cartId: cartId });

    const selectedPaymentMethod = summaryData ? summaryData.cart.selected_payment_method : null;

    return {
        isLoading: summaryDataLoading,
        selectedPaymentMethod
    };
};
