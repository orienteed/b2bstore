import { useCallback, useState } from 'react';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';
import { useMutation } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const useProduct = props => {
    const { beginEditItem, item, removeItemMutation } = props;

    const { createCart, getCartDetails } = useAdapter();

    const { configurable_options: options, product, quantity, prices } = item;
    const { price } = prices;
    const { small_image: image, name } = product;

    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [, { removeItemFromCart }] = useCartContext();

    // BIGCOMMERCE ADAPTER

    const { fetchCartId } = createCart();

    const { fetchCartDetails } = getCartDetails();

    // END

    const [removeItem] = useMutation(removeItemMutation);

    const handleFavoriteItem = useCallback(() => {
        setIsFavorite(!isFavorite);
    }, [isFavorite]);

    const handleEditItem = useCallback(() => {
        beginEditItem(item);
    }, [beginEditItem, item]);

    const handleRemoveItem = useCallback(() => {
        setIsLoading(true);
        removeItemFromCart({
            item,
            fetchCartDetails,
            fetchCartId,
            removeItem
        });
    }, [fetchCartDetails, fetchCartId, item, removeItem, removeItemFromCart]);

    return {
        handleEditItem,
        handleFavoriteItem,
        handleRemoveItem,
        isFavorite,
        isLoading,
        productImage: image.url,
        productName: name,
        productOptions: options,
        productPrice: price.value,
        productQuantity: quantity
    };
};
