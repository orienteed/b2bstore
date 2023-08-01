import { useCallback, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import DEFAULT_OPERATIONS from './savedCarts.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useAdapter } from '../../hooks/useAdapter';

export const useShareCartPage = async () => {
    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { shareSavedCartsMutation } = operations;

    const [isLoading, setIsLoading] = useState(true);
    const [shareCartUpadte, setShareCartUpadte] = useState(1);
    const { pathname } = useLocation();
    const url = pathname.split('/');
    const history = useHistory();

    const [{ cartId }, { getCartDetails }] = useCartContext();

    // Share Cart
    const [getShareCart] = useMutation(shareSavedCartsMutation);

    const { getCartDetails: getCartDetailsFromAdapter } = useAdapter();
    const { fetchCartDetails } = getCartDetailsFromAdapter();

    const handleShareCart = useCallback(async () => {
        const token = url[5];
        if (shareCartUpadte == 1 && cartId) {
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
                 setShareCartUpadte(2);
            }
        }
    }, [getCartDetails, cartId, fetchCartDetails, shareCartUpadte, url, getShareCart, history]);

    useEffect(() => {
        const shareCart = async () => {
            if (!url[5]) {
                setIsLoading(false);
                history.push('/cart');
            } else {
                await handleShareCart();
            }
        };
        shareCart();
    }, [url, handleShareCart, history]);

    return {
        isLoading
    };
};
