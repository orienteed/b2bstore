import { useCallback, useEffect, useMemo, useState, useRef } from 'react';

import { MOCKED_ADDRESS } from '../../CartPage/PriceAdjustments/ShippingMethods/useShippingForm';

import { useAppContext } from '../../../context/app';
import { useCartContext } from '../../../context/cart';
import { useEventingContext } from '../../../context/eventing';
import { useUserContext } from '../../../context/user';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

export const useShippingInformation = props => {
    const { onSave, toggleActiveContent } = props;

    const [, { toggleDrawer }] = useAppContext();
    const [{ cartId }] = useCartContext();
    const [{ isSignedIn }] = useUserContext();

    const [hasUpdate, setHasUpdate] = useState(false);
    const hasLoadedData = useRef(false);

    const { getDefaultShipping, getShippingInformation, setCustomerAddressIdOnCart } = useAdapter();

    const { data: shippingInformationData, loading: getShippingInformationLoading } = getShippingInformation({ cartId: cartId });

    const { data: defaultShippingData, loading: getDefaultShippingLoading } = getDefaultShipping({ isSignedIn: isSignedIn });

    const { setDefaultAddressOnCart, loading: setDefaultAddressLoading } = setCustomerAddressIdOnCart({ hasOnSuccess: false });

    const isLoading = getShippingInformationLoading || getDefaultShippingLoading || setDefaultAddressLoading;

    const shippingData = useMemo(() => {
        let filteredData;
        if (shippingInformationData) {
            const { cart } = shippingInformationData;
            const { email, shipping_addresses: shippingAddresses } = cart;
            if (shippingAddresses.length) {
                const primaryAddress = { ...shippingAddresses[0] };
                for (const field in MOCKED_ADDRESS) {
                    if (primaryAddress[field] === MOCKED_ADDRESS[field]) {
                        primaryAddress[field] = '';
                    }

                    if (field === 'street' && primaryAddress[field][0] === MOCKED_ADDRESS[field][0]) {
                        primaryAddress[field] = [''];
                    }
                }

                const { region_id, label: region, code: region_code } = primaryAddress.region;

                primaryAddress.region = {
                    region_code,
                    region_id,
                    region
                };

                filteredData = {
                    email,
                    ...primaryAddress
                };
            }
        }

        return filteredData;
    }, [shippingInformationData]);

    // Simple heuristic to check shipping data existed prior to this render.
    // On first submission, when we have data, we should tell the checkout page
    // so that we set the next step correctly.
    const doneEditing = !!shippingData && !!shippingData.city;
    const [, { dispatch }] = useEventingContext();

    useEffect(() => {
        if (doneEditing) {
            onSave();
        }
    }, [doneEditing, onSave]);

    useEffect(() => {
        let updateTimer;
        if (shippingData !== undefined) {
            if (hasLoadedData.current) {
                setHasUpdate(true);
                updateTimer = setTimeout(() => {
                    setHasUpdate(false);
                }, 2000);
            } else {
                hasLoadedData.current = true;
            }
        }

        return () => {
            if (updateTimer) {
                clearTimeout(updateTimer);
            }
        };
    }, [hasLoadedData, shippingData]);

    useEffect(() => {
        if (shippingInformationData && !doneEditing && cartId && defaultShippingData) {
            const { customer } = defaultShippingData;
            const { default_shipping: defaultAddressId } = customer;
            if (defaultAddressId) {
                setDefaultAddressOnCart({
                    variables: {
                        cartId,
                        addressId: parseInt(defaultAddressId)
                    }
                });
            }
        }
    }, [cartId, doneEditing, defaultShippingData, setDefaultAddressOnCart, shippingInformationData]);

    const handleEditShipping = useCallback(() => {
        if (isSignedIn) {
            toggleActiveContent();
        } else {
            toggleDrawer('shippingInformation.edit');
        }
    }, [isSignedIn, toggleActiveContent, toggleDrawer]);

    useEffect(() => {
        if (doneEditing && hasUpdate) {
            dispatch({
                type: 'CHECKOUT_SHIPPING_INFORMATION_UPDATED',
                payload: {
                    cart_id: cartId
                }
            });
        }
    }, [cartId, doneEditing, dispatch, hasUpdate]);

    return {
        doneEditing,
        handleEditShipping,
        hasUpdate,
        isLoading,
        isSignedIn,
        shippingData
    };
};
