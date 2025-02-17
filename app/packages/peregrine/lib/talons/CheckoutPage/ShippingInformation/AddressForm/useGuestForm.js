import { useCallback, useMemo, useState, useEffect } from 'react';
import { validatePostcode } from '@magento/venia-ui/lib/util/formValidators';

import { useCartContext } from '../../../../context/cart';
import { useEventingContext } from '../../../../context/eventing';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

export const useGuestForm = props => {
    const { afterSubmit, onCancel, onSuccess, shippingData, toggleSignInContent, setGuestSignInUsername } = props;
    const [showSignInToast, setShowSignInToast] = useState(false);

    const { setGuestShipping: setGuestShippingFromAdapter, isEmailAvailable } = useAdapter();

    const [{ cartId }] = useCartContext();

    const { setGuestShipping, error, loading } = setGuestShippingFromAdapter({ onSuccess: onSuccess });

    const { runQuery, data } = isEmailAvailable();

    const { country } = shippingData;
    const { code: countryCode } = country;

    const initialValues = {
        ...shippingData,
        country: countryCode
    };

    // Simple heuristic to indicate form was submitted prior to this render
    const isUpdate = !!shippingData.city;

    const [, { dispatch }] = useEventingContext();
    const dispatchEvent = useCallback(() => {
        if (!isUpdate) {
            dispatch({
                type: 'CHECKOUT_SHIPPING_INFORMATION_ADDED',
                payload: {
                    cart_id: cartId
                }
            });
        }
    }, [isUpdate, cartId, dispatch]);

    const handleSubmit = useCallback(
        async formValues => {
            const { country, email, region, postcode, ...address } = formValues;
            if(!validatePostcode(postcode, country)) return; 
            try {
                await setGuestShipping({
                    variables: {
                        cartId,
                        email,
                        address: {
                            ...address,
                            // Cleans up the street array when values are null or undefined
                            street: address.street.filter(e => e),
                            // region_id is used for field select and region is used for field input
                            region: region.region_id || region.region,
                            country_code: country,
                            postcode: postcode
                        }
                    }
                });
                dispatchEvent();
            } catch {
                return;
            }

            if (afterSubmit) {
                afterSubmit();
            }
        },
        [afterSubmit, cartId, setGuestShipping, dispatchEvent]
    );

    const handleCancel = useCallback(() => {
        onCancel();
    }, [onCancel]);

    const handleValidateEmail = useCallback(
        email => {
            setShowSignInToast(false);
            if (email && email.includes('@')) {
                runQuery({ variables: { email } });
            }
        },
        [runQuery]
    );

    const handleToastAction = useCallback(
        (removeToast, email) => {
            setGuestSignInUsername(email);
            toggleSignInContent();
            removeToast();
        },
        [setGuestSignInUsername, toggleSignInContent]
    );

    const errors = useMemo(() => new Map([['setGuestShippingMutation', error]]), [error]);

    useEffect(() => {
        if (data) {
            setShowSignInToast(!data.isEmailAvailable.is_email_available);
        }
    }, [data]);

    return {
        errors,
        handleCancel,
        handleSubmit,
        handleValidateEmail,
        handleToastAction,
        initialValues,
        isSaving: loading,
        isUpdate,
        showSignInToast
    };
};
