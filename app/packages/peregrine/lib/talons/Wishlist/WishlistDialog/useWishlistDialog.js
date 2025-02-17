import { useCallback, useMemo, useState } from 'react';
import { useStoreConfigContext } from '@magento/peregrine/lib/context/storeConfigProvider';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

export const useWishlistDialog = props => {
    const { isLoading, itemOptions, onClose, onSuccess } = props;

    const { addProductToWishlist: addProductToWishlistFromAdapter, getWishlists } = useAdapter();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const { data: storeConfigData } = useStoreConfigContext();

    const { data: wishlistsData } = getWishlists();

    const {
        addProductToWishlist,
        loading: isAddLoading,
        error: addProductError
    } = addProductToWishlistFromAdapter({ hasRefetch: true });

    // enable_multiple_wishlists is a string "1" or "0". See documentation here:
    // https://devdocs.magento.com/guides/v2.4/graphql/mutations/create-wishlist.html
    const canCreateWishlist = useMemo(() => {
        return (
            wishlistsData &&
            !!storeConfigData.storeConfig.enable_multiple_wishlists &&
            storeConfigData.storeConfig.maximum_number_of_wishlists > wishlistsData.customer.wishlists.length
        );
    }, [wishlistsData]);

    const handleAddToWishlist = useCallback(
        async wishlistId => {
            try {
                const { data } = await addProductToWishlist({
                    variables: {
                        wishlistId,
                        itemOptions
                    }
                });

                if (onSuccess) {
                    await onSuccess(data);
                }

                if (onClose) {
                    onClose(true, {
                        wishlistName: data.addProductsToWishlist.wishlist.name
                    });
                }

                setIsFormOpen(false);
            } catch (err) {
                console.log(err);
            }
        },
        [addProductToWishlist, itemOptions, onClose, onSuccess]
    );

    const handleNewListClick = useCallback(() => {
        setIsFormOpen(true);
    }, []);

    const handleCancelNewList = useCallback(() => {
        setIsFormOpen(false);
    }, []);

    const handleCancel = useCallback(() => {
        onClose();
        setIsFormOpen(false);
    }, [onClose]);

    return {
        formErrors: [addProductError],
        canCreateWishlist,
        handleAddToWishlist,
        handleCancel,
        handleCancelNewList,
        handleNewListClick,
        isLoading: isLoading || isAddLoading,
        isFormOpen,
        wishlistsData
    };
};
