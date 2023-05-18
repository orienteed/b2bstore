import { useCallback, useState } from 'react';

import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

export const useCreditCard = props => {
    const { paymentHash } = props;

    const { deleteCreditCardPayment } = useAdapter();

    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    const {deletePayment, error, loading } = deleteCreditCardPayment();

    const handleDeletePayment = useCallback(async () => {
        try {
            await deletePayment({ variables: { paymentHash } });
        } catch {
            setIsConfirmingDelete(false);
        }
    }, [deletePayment, paymentHash]);

    const toggleDeleteConfirmation = useCallback(() => {
        setIsConfirmingDelete(current => !current);
    }, []);

    return {
        handleDeletePayment,
        hasError: !!error,
        isConfirmingDelete,
        isDeletingPayment: loading,
        toggleDeleteConfirmation
    };
};
