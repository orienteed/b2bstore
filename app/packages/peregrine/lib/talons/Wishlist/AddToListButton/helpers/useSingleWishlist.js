import { useCallback, useMemo, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';
import { useWishlistPage } from '@magento/peregrine/lib/talons/WishlistPage/useWishlistPage';
import { useUserContext } from '@magento/peregrine/lib/context/user';

export const useSingleWishlist = props => {
    const { afterAdd, beforeAdd, item } = props;
    const talonProps = useWishlistPage();
    const {
        errors,
        loading,
        shouldRenderVisibilityToggle,
        wishlists
    } = talonProps;
    const wishlistId = (wishlists?.length) ? wishlists[0].id: "";  

    const {
        addProductToWishlist: addProductToWishlistFromAdapter,
        getProductsInWishlists,
        removeProductsFromWishlist: removeProductsFromWishlistFromAdapter,
        getWishlistProducts
    } = useAdapter();
    const {
        addProductToWishlist,
        data: addProductData,
        error: errorAddingProduct,
        loading: isAddingToWishlist
    } = addProductToWishlistFromAdapter();
         
    const [wishlistUpdated, setWishlistUpdated] = useState(0);

    const { fetchWishlistItems, queryResult } = getWishlistProducts({ id: wishlistId, currentPage: 1 });
    const { data, error, fetchMore } = queryResult;
    useEffect(() => {
            fetchWishlistItems();
    }, [fetchWishlistItems, data, wishlistUpdated]);
    
    // Retrieving wishlist item id by item sku
    const wishlistItems = data?.customer?.wishlist_v2?.items_v2?.items?.filter(el => el.product.sku == item.sku);
    const wishlistItemIds = wishlistItems?.map(item => item.id);
    
    const {
        removeProductsFromWishlist,
        data: removeProductData,
        error: errorRemovingProduct
    } = removeProductsFromWishlistFromAdapter({
        wishlistId: wishlistId,
        wishlistItemsId: wishlistItemIds,
        item,
        sku: item.sku,
        isFromUse: true
    });    

    const {
        client,
        data: { customerWishlistProducts },
        getProductsInWishlistsQuery
    } = getProductsInWishlists();

    const isSelected = useMemo(() => {
        return customerWishlistProducts.includes(item.sku);
    }, [customerWishlistProducts, isAddingToWishlist, item.sku]);

    const [showLoginToast, setShowLoginToast] = useState(0);

    const { formatMessage } = useIntl();
    const [{ isSignedIn }] = useUserContext();

    const handleClick = useCallback(async () => {
        if (!isSignedIn) {
            setShowLoginToast(current => ++current);
            return;
        } else {
            try {
                if (isSelected) {
                    await removeProductsFromWishlist();
                } else {
                    if (beforeAdd) {
                        await beforeAdd();
                    }

                    await addProductToWishlist({
                        variables: { wishlistId: '0', itemOptions: item }
                    });
                    setWishlistUpdated(prev => prev + 1);
                    client.writeQuery({
                        query: getProductsInWishlistsQuery,
                        data: {
                            customerWishlistProducts: [...customerWishlistProducts, item.sku]
                        }
                    });

                    if (afterAdd) {
                        afterAdd();
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
    }, [
        addProductToWishlist,
        afterAdd,
        beforeAdd,
        client,
        customerWishlistProducts,
        isSignedIn,
        item,
        getProductsInWishlistsQuery
    ]);

    const loginToastProps = useMemo(() => {
        if (showLoginToast) {
            return {
                type: 'info',
                message: formatMessage({
                    id: 'wishlist.galleryButton.loginMessage',
                    defaultMessage: 'Please sign-in to your Account to save items for later.'
                }),
                timeout: 5000
            };
        }

        return null;
    }, [formatMessage, showLoginToast]);

    const successToastProps = useMemo(() => {
        if (addProductData) {
            return {
                type: 'success',
                message: formatMessage({
                    id: 'wishlist.galleryButton.successMessageGeneral',
                    defaultMessage: 'Item successfully added to your favorites list.'
                }),
                timeout: 5000
            };
        }

        return null;
    }, [addProductData, formatMessage]);

    const errorToastProps = useMemo(() => {
        if (errorAddingProduct) {
            return {
                type: 'error',
                message: formatMessage({
                    id: 'wishlist.galleryButton.addError',
                    defaultMessage: 'Something went wrong adding the product to your wishlist.'
                }),
                timeout: 5000
            };
        }

        return null;
    }, [errorAddingProduct, formatMessage]);

    const removeSuccessToastProps = useMemo(() => {
        if (removeProductData) {
            return {
                type: 'success',
                message: formatMessage({
                    id: 'wishlist.galleryButton.removeSuccessMessage',
                    defaultMessage: 'Item successfully removed from your favorites list.'
                }),
                timeout: 5000
            };
        }
        return null;
    }, [removeProductData, formatMessage]);

    const removeErrorToastProps = useMemo(() => {
        if (errorRemovingProduct) {
            return {
                type: 'error',
                message: formatMessage({
                    id: 'wishlist.galleryButton.removeError',
                    defaultMessage: 'Something went wrong removing the product from your wishlist.'
                }),
                timeout: 5000
            };
        }
        return null;
    }, [errorRemovingProduct, formatMessage]);

    const buttonProps = useMemo(
        () => ({
            'aria-label': formatMessage({
                id: 'wishlistButton.addText',
                defaultMessage: 'Add to Favorites'
            }),
            onPress: handleClick,
            type: 'button'
        }),
        [formatMessage, handleClick, isSelected]
    );

    return {
        buttonProps,
        buttonText: props.buttonText && props.buttonText(isSelected),
        customerWishlistProducts,
        errorToastProps,
        handleClick,
        isSelected,
        loginToastProps,
        successToastProps,
        removeSuccessToastProps,
        removeErrorToastProps
    };
};
