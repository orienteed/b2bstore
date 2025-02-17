import { useCallback, useEffect, useState, useRef, useMemo } from 'react';

import { useAppContext } from '../../../context/app';
import { useCartContext } from '../../../context/cart';
import { useUserContext } from '../../../context/user';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';
import { deriveErrorMessage } from '../../../util/deriveErrorMessage';

export const useAddressBook = props => {
    const { toggleActiveContent, onSuccess } = props;

    const { setCustomerAddressIdOnCart, getCustomerAddressesForAddressBook, getCustomerCartAddressesForAddressBook } = useAdapter();

    const [, { toggleDrawer }] = useAppContext();
    const [{ cartId }] = useCartContext();
    const [{ isSignedIn }] = useUserContext();

    const addressCount = useRef();
    const [activeAddress, setActiveAddress] = useState();
    const [selectedAddress, setSelectedAddress] = useState();

    const {
        setCustomerAddressOnCart,
        error: setCustomerAddressOnCartError,
        loading: setCustomerAddressOnCartLoading
    } = setCustomerAddressIdOnCart({ onSuccess: onSuccess, hasOnSuccess: true });

    const { data: customerAddressesData, loading: customerAddressesLoading } = getCustomerAddressesForAddressBook({ hasNextFetchPolicy: true, isSignedIn: isSignedIn });

    const { data: customerCartAddressData, loading: customerCartAddressLoading } = getCustomerCartAddressesForAddressBook({ isSignedIn: isSignedIn });

    const derivedErrorMessage = useMemo(() => deriveErrorMessage([setCustomerAddressOnCartError]), [
        setCustomerAddressOnCartError
    ]);

    const isLoading = customerAddressesLoading || customerCartAddressLoading || setCustomerAddressOnCartLoading;

    const customerAddresses = useMemo(() => (customerAddressesData && customerAddressesData.customer.addresses) || [], [
        customerAddressesData
    ]);

    useEffect(() => {
        if (customerAddresses.length !== addressCount.current) {
            // Auto-select newly added address when count changes
            if (addressCount.current) {
                const newestAddress = customerAddresses[customerAddresses.length - 1];
                setSelectedAddress(newestAddress.id);
            }

            addressCount.current = customerAddresses.length;
        }
    }, [customerAddresses]);

    const handleEditAddress = useCallback(
        address => {
            setActiveAddress(address);
            toggleDrawer('shippingInformation.edit');
        },
        [toggleDrawer]
    );

    const handleAddAddress = useCallback(() => {
        handleEditAddress();
    }, [handleEditAddress]);

    const handleSelectAddress = useCallback(addressId => {
        setSelectedAddress(addressId);
    }, []);

    // GraphQL doesn't return which customer address is selected, so perform
    // a simple search to initialize this selected address value.
    if (customerAddresses.length && customerCartAddressData && !selectedAddress) {
        const { customerCart } = customerCartAddressData;
        const { shipping_addresses: shippingAddresses } = customerCart;
        if (shippingAddresses.length) {
            const primaryCartAddress = shippingAddresses[0];

            const foundSelectedAddress = customerAddresses.find(
                customerAddress =>
                    customerAddress.street[0] === primaryCartAddress.street[0] &&
                    customerAddress.firstname === primaryCartAddress.firstname &&
                    customerAddress.lastname === primaryCartAddress.lastname
            );

            if (foundSelectedAddress) {
                setSelectedAddress(foundSelectedAddress.id);
            }
        }
    }

    const handleApplyAddress = useCallback(async () => {
        try {
            await setCustomerAddressOnCart({
                variables: {
                    cartId,
                    addressId: selectedAddress
                }
            });
        } catch {
            return;
        }

        toggleActiveContent();
    }, [cartId, selectedAddress, setCustomerAddressOnCart, toggleActiveContent]);

    const handleCancel = useCallback(() => {
        setSelectedAddress();
        toggleActiveContent();
    }, [toggleActiveContent]);

    return {
        activeAddress,
        customerAddresses,
        errorMessage: derivedErrorMessage,
        isLoading,
        handleAddAddress,
        handleApplyAddress,
        handleCancel,
        handleSelectAddress,
        handleEditAddress,
        selectedAddress
    };
};
