import { useCallback, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useAdapter } from '../../hooks/useAdapter';

import DEFAULT_OPERATIONS from './savedCarts.gql';
import CART_OPERATIONS from '../CartPage/cartPage.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

export const useShareCartPage = async () => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, CART_OPERATIONS);
    const { shareSavedCartsMutation } = operations;
    const { getCartDetails: getCartDetailsFromAdapter } = useAdapter();

    const [isLoading, setIsLoading] = useState(true);
    const [shareCartUpadte, setShareCartUpadte] = useState(1);
    const { pathname } = useLocation();
    const url = pathname.split('/');
    const history = useHistory();

    const [{ cartId }, { getCartDetails }] = useCartContext();

    // BIGCOMMERCE ADAPTER

    const { fetchCartDetails } = getCartDetailsFromAdapter();

    // END

    // Share Cart
    const [getShareCart] = useMutation(shareSavedCartsMutation);

    const handleShareCart = useCallback(async () => {
        const token = url[5];
        if (shareCartUpadte == 1) {
            const {
                data: { mpSaveCartShareCart }
            } = await getShareCart({
                fetchPolicy: 'no-cache',
                variables: {
                    token: token,
                    cartId: cartId
                }
            });

            if (mpSaveCartShareCart) {
                await getCartDetails({
                    cartId,
                    fetchCartDetails
                });
                setIsLoading(false);
                history.push('/cart');
            }
        }
    }, [getCartDetails, cartId, fetchCartDetails, shareCartUpadte, url, getShareCart, history]);

    useEffect(() => {
        if (!url[5]) {
            setIsLoading(false);
            history.push('/cart');
        } else {
            handleShareCart();
            setShareCartUpadte(2);
        }
    }, [url, handleShareCart, history]);

    return {
        isLoading
    };
};
