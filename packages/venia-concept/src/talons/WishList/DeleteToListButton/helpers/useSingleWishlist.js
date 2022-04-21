import { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useMutation} from '@apollo/client';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import defaultOperations from '../deleteToListButton.gql';

export const useSingleWishlist = props => {
    const { afterRemove, beforeRemove, client, customerWishlistProducts, wishListItems, wishListId, item } = props;

    const operations = mergeOperations(defaultOperations, props.operations);

    const [
        removeProductToWishlist,
        {
            data: productData,
            error: errorRemovingProduct,
            loading: isRemovingToWishlist
        }
    ] = useMutation(operations.removeProductToWishlistMutation);

    const [isSelectedRemove, setIsSelectedRemove] = useState(false);

    const [wishListItemSelected, setWishListItemSelected] = useState(null);

    useMemo(() => {
        wishListItems != null ? wishListItems.forEach(wishItem => {
            if(wishItem.product.sku == item.sku){
                setIsSelectedRemove(true)
                setWishListItemSelected(wishItem);
                return;
            }
            setIsSelectedRemove(false)
        }) : null;
    },[ wishListItems, item.sku ]);

    const [showLoginToast, setShowLoginToast] = useState(0);

    const { formatMessage } = useIntl();
    const [{ isSignedIn }] = useUserContext();

    const handleClick = useCallback(async () => {
        if (!isSignedIn) {
            setShowLoginToast(current => ++current);
        } else {
            try {
                if (beforeRemove) {
                    await beforeRemove();
                }
                
                if(wishListItemSelected){
                    await removeProductToWishlist({
                        variables: { wishlistId: wishListId, wishlistItemsId: [wishListItemSelected.id]}
                    });
    
                    client.writeQuery({
                        query: operations.getProductsInWishlistsQuery,
                        data: {
                            customerWishlistProducts: [
                                ...customerWishlistProducts,
                                item.sku
                            ]
                        }
                    });

                    setIsSelectedRemove(false);
                }

                if (afterRemove) {
                    afterRemove();
                }
                
            } catch (error) {
                console.error(error);
            }
        }
    }, [
        removeProductToWishlist,
        afterRemove,
        beforeRemove,
        client,
        customerWishlistProducts,
        isSignedIn,
        item,
        wishListItemSelected,
        operations.getProductsInWishlistsQuery
    ]);

    const loginToastProps = useMemo(() => {
        if (showLoginToast) {
            return {
                type: 'info',
                message: formatMessage({
                    id: 'wishlist.galleryButton.loginMessage',
                    defaultMessage:
                        'Please sign-in to your Account to remove items for later.'
                }),
                timeout: 5000
            };
        }

        return null;
    }, [formatMessage, showLoginToast]);

    const successToastProps = useMemo(() => {
        if (productData) {
            return {
                type: 'success',
                message: formatMessage({
                    id: 'wishlist.galleryButton.successMessageGeneralRemove',
                    defaultMessage:
                        'Item successfully removed to your favorites list.'
                }),
                timeout: 5000
            };
        }

        return null;
    }, [productData, formatMessage]);

    const errorToastProps = useMemo(() => {
        if (errorRemovingProduct) {
            return {
                type: 'error',
                message: formatMessage({
                    id: 'wishlist.galleryButton.addErrorRemove',
                    defaultMessage:
                        'Something went wrong removing the product to your wishlist.'
                }),
                timeout: 5000
            };
        }

        return null;
    }, [errorRemovingProduct, formatMessage]);

    const buttonProps = useMemo(
        () => ({
            'aria-label': formatMessage({
                id: 'wishlistButton.removeText',
                defaultMessage: 'Remove from Favorites'
            }),
            isDisabled: !isSelectedRemove,
            onPress: handleClick,
            type: 'button'
        }),
        [formatMessage, handleClick, isSelectedRemove]
    );

    return {
        buttonProps,
        buttonText: props.buttonText && props.buttonText(isSelectedRemove),
        customerWishlistProducts,
        errorToastProps,
        handleClick,
        isSelectedRemove,
        loginToastProps,
        successToastProps
    };
};
