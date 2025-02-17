import { useCallback, useMemo } from 'react';
import { useCheckoutContext } from '@magento/peregrine/lib/context/checkout';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

/**
 * Returns values used to render an AddressForm component.
 *
 * @param {Object} props
 * @param {Object[]} props.fields an array of fields to reduce over for initial values
 * @param {function} props.onCancel cancel callback
 * @param {function} props.onSubmit submit callback
 * @returns {{
 *   handleCancel: function,
 *   handleSubmit: function,
 *   initialValues: object
 * }}
 */
export const useAddressForm = props => {
    const { countries, fields, onCancel, onSubmit } = props;

    const { setShippingAddress, setGuestEmailOnCart } = useAdapter();

    const [{ shippingAddress, shippingAddressError }, { submitShippingAddress }] = useCheckoutContext();

    const [{ isSignedIn }] = useUserContext();

    const { setGuestEmail } = setGuestEmailOnCart();

    const { setShippingAddressOnCart } = setShippingAddress();

    const values = useMemo(
        () =>
            fields.reduce((acc, key) => {
                acc[key] = shippingAddress[key];
                return acc;
            }, {}),
        [fields, shippingAddress]
    );

    const handleCancel = useCallback(() => {
        onCancel();
    }, [onCancel]);

    const handleSubmit = useCallback(
        async addressFormValues => {
            try {
                await submitShippingAddress({
                    formValues: addressFormValues,
                    countries,
                    setGuestEmail,
                    setShippingAddressOnCart
                });
                onSubmit();
            } catch (error) {
                console.error(error);
            }
        },
        [countries, onSubmit, setGuestEmail, setShippingAddressOnCart, submitShippingAddress]
    );

    return {
        error: shippingAddressError,
        handleCancel,
        handleSubmit,
        isSignedIn,
        initialValues: values
    };
};
