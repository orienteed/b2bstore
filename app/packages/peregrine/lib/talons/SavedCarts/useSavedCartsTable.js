import { useCallback, useState } from 'react';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import { useAdapter } from '../../hooks/useAdapter';

/**
 * @function
 *
 * @param {Object} props
 *
 * @returns {SavedCartsTableProps}
 */
export const useSavedCartsTable = props => {
    const { handleIsLoading, getSavedCarts } = props;

    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [token, setToken] = useState();

    const [{ cartId }, { getCartDetails }] = useCartContext();

    const { getCartDetails: getCartDetailsFromAdapter, deleteSavedCarts, restoreSavedCarts } = useAdapter();
    const { fetchCartDetails } = getCartDetailsFromAdapter();

    // Restore Cart
    const { restoreSaveCart } = restoreSavedCarts({ token: token, cartId: cartId });

    // Delete save cart
    const { deleteSaveCart } = deleteSavedCarts({ token: token });

    const handleContentToggle = useCallback(() => {
        setIsOpen(currentValue => !currentValue);
    }, []);

    // Copy URL
    const copyCartUrl = useCallback(obj => {
        const baseUrl = window.location.origin;
        const cartUrl = `${baseUrl}/mpsavecart/cart/share/id/${obj}`;
        navigator.clipboard.writeText(cartUrl);

        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1500);
    }, []);

    const handleDeleteSaveCart = useCallback(
        async event => {
            await setToken(event.target.id);
            await handleIsLoading(true);
            await deleteSaveCart();
            await getSavedCarts();
            await handleIsLoading(false);
        },
        [deleteSaveCart, handleIsLoading, getSavedCarts]
    );

    const handleRestoreSaveCart = useCallback(
        async event => {
            await setToken(event.target.id);
            await handleIsLoading(true);
            await restoreSaveCart();
            await getCartDetails({
                cartId,
                fetchCartDetails
            });
            location.reload();
            await getSavedCarts();
            await handleIsLoading(false);
        },
        [getCartDetails, cartId, restoreSaveCart, handleIsLoading, getSavedCarts, fetchCartDetails]
    );

    return {
        copied,
        isOpen,
        handleContentToggle,
        copyCartUrl,
        handleDeleteSaveCart,
        handleRestoreSaveCart
    };
};

/**
 * JSDoc type definitions
 */

/**
 * Props data to use when rendering a collapsed image gallery
 *
 * @typedef {Object} SavedCartsTableTalonProps
 *
 * @property {Boolean} isOpen Boolean which represents if a row is open or not
 * @property {Function} handleContentToggle Callback to toggle isOpen value
 */
