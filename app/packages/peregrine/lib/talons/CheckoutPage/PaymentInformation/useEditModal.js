import { useState, useCallback } from 'react';

import { useCartContext } from '../../../context/cart';
import { useEventingContext } from '../../../context/eventing';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

/**
 * Talon to handle checkout page's payment information edit modal.
 *
 * @param {Function} props.onClose callback to be called when the modal's close or cancel button is clicked.
 * @param {DocumentNode} props.operations.getSelectedPaymentMethodQuery query to fetch the payment method that was used in the payment information checkout step
 *
 * @returns {
 *   selectedPaymentMethod: String,
 *   isLoading: Boolean,
 *   updateButtonClicked: Boolean,
 *   handleClose: Function,
 *   handleUpdate: Function,
 *   handlePaymentError: Function,
 *   handlePaymentReady: Function,
 *   handlePaymentSuccess: Function,
 *   resetUpdateButtonClicked: Function
 * }
 */
export const useEditModal = props => {
    const { onClose } = props;

    /**
     * Definitions
     */

    const [isLoading, setIsLoading] = useState(true);
    const [updateButtonClicked, setUpdateButtonClicked] = useState(false);
    const [{ cartId }] = useCartContext();
    const [, { dispatch }] = useEventingContext();
    const { getSelectedPaymentMethod } = useAdapter();

    /**
     * Queries
     */

    const { data: selectedPaymentMethodData } = getSelectedPaymentMethod({ cartId: cartId });
    const selectedPaymentMethod = selectedPaymentMethodData
        ? selectedPaymentMethodData.cart.selected_payment_method.code
        : null;

    /**
     * Helper Functions
     */

    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    const handleUpdate = useCallback(() => {
        setUpdateButtonClicked(true);
    }, [setUpdateButtonClicked]);

    const handlePaymentSuccess = useCallback(() => {
        onClose();
        dispatch({
            type: 'CHECKOUT_BILLING_INFORMATION_UPDATED',
            payload: {
                cart_id: cartId,
                selected_payment_method: selectedPaymentMethod
            }
        });
    }, [onClose, dispatch, cartId, selectedPaymentMethod]);

    const handlePaymentError = useCallback(() => {
        setUpdateButtonClicked(false);
    }, []);

    const handlePaymentReady = useCallback(() => {
        setIsLoading(false);
    }, [setIsLoading]);

    const resetUpdateButtonClicked = useCallback(() => {
        setUpdateButtonClicked(false);
    }, [setUpdateButtonClicked]);

    return {
        selectedPaymentMethod,
        isLoading,
        updateButtonClicked,
        handleClose,
        handleUpdate,
        handlePaymentError,
        handlePaymentReady,
        handlePaymentSuccess,
        resetUpdateButtonClicked
    };
};
