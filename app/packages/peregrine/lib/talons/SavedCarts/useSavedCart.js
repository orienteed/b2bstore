import { useCallback, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { clearCartDataFromCache } from '@magento/peregrine/lib/Apollo/clearCartDataFromCache';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

export const useSavedCart = () => {
    const {
        createCart: createCartFromAdapter,
        getCartDetails: getCartDetailsFromAdapter,
        getConfigDetailsForSavedCarts,
        saveSavedCarts
    } = useAdapter();

    const [isShow, setIsShow] = useState(false);
    const [buttonTitle, setButtonTitle] = useState();
    const [isSaveCartLoading, setIsSaveCartLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const apolloClient = useApolloClient();

    const [{ cartId }, { getCartDetails, createCart }] = useCartContext();

    const { fetchCartId } = createCartFromAdapter();
    const { fetchCartDetails } = getCartDetailsFromAdapter();

    const history = useHistory();

    const { getMpSaveCart } = saveSavedCarts();

    // Popup Open
    const handleSaveCart = useCallback(() => {
        setIsDialogOpen(true);
    }, [setIsDialogOpen]);
    const handleCancelDialog = useCallback(() => {
        setIsDialogOpen(false);
    }, []);

    // Getting Config details
    const { data } = getConfigDetailsForSavedCarts();
    useEffect(() => {
        if (data != undefined) {
            const {
                mpSaveCartConfigs: { enabled, button_title }
            } = data;
            if (enabled) {
                setButtonTitle(button_title);
                setIsShow(true);
            }
        }
    }, [data]);

    // Create New Save Cart
    const handleSubmitDialog = useCallback(
        async params => {
            try {
                const { mpsavecart_description, mpsavecart_name } = params;
                setIsSaveCartLoading(true);
                setErrorMessage(null);
                const {
                    data: { o_mpSaveCart }
                } = await getMpSaveCart({
                    fetchPolicy: 'no-cache',
                    variables: {
                        cartId: cartId,
                        cartName: mpsavecart_name,
                        description: mpsavecart_description
                    }
                });

                if (o_mpSaveCart) {
                    await clearCartDataFromCache(apolloClient);
                    await createCart({
                        fetchCartId
                    });

                    await getCartDetails({
                        cartId,
                        fetchCartDetails
                    });
                    setIsSaveCartLoading(false);
                    history.push('/mpsavecart');
                }
            } catch (e) {
                const error = e.toString();
                setErrorMessage(error.replace('Error:', ''));
                setIsError(true);
                setIsSaveCartLoading(false);
            }
        },
        [getMpSaveCart, getCartDetails, cartId, fetchCartDetails, fetchCartId, createCart, apolloClient, history]
    );

    return {
        isShow,
        buttonTitle,
        isSaveCartLoading,
        handleSaveCart,
        isError,
        errorMessage,
        isDialogOpen,
        handleCancelDialog,
        handleSubmitDialog
    };
};
