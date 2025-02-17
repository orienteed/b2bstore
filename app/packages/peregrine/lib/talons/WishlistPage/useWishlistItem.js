import { useCallback, useMemo, useState } from 'react';

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

import { useEventingContext } from '../../context/eventing';

const SUPPORTED_PRODUCT_TYPES = ['SimpleProduct', 'ConfigurableProduct'];

const mergeSupportedProductTypes = (supportedProductTypes = []) => {
    const newSupportedProductTypes = [...SUPPORTED_PRODUCT_TYPES];

    if (supportedProductTypes) {
        newSupportedProductTypes.push(...supportedProductTypes);
    }

    return newSupportedProductTypes;
};

/**
 * @function
 *
 * @param {String} props.item Wishlist Item data from GraphQL
 * @param {WishlistItemOperations} props.operations GraphQL operations for the Wishlist Item component
 * @param {String} props.wishlistId The ID of the wishlist this item belongs to
 *
 * @returns {WishlistItemProps}
 */
export const useWishlistItem = props => {
    const { item, onOpenAddToCartDialog, wishlistId } = props;
    const [, { dispatch }] = useEventingContext();

    const { configurable_options: selectedConfigurableOptions = [], id: itemId, product } = item;

    const {
        configurable_options: configurableOptions = [],
        __typename: productType,
        image,
        sku,
        stock_status: stockStatus
    } = product;
    const { label: imageLabel, url: imageURL } = image;

    const isSupportedProductType = useMemo(
        () => mergeSupportedProductTypes(props.supportedProductTypes).includes(productType),
        [props.supportedProductTypes, productType]
    );

    const {
        addConfigurableProductToCart: addConfigurableProductToCartFromAdapter,
        addProductToCart,
        removeProductsFromWishlist: removeProductsFromWishlistFromAdapter
    } = useAdapter();

    const [{ cartId }] = useCartContext();

    const [isRemovalInProgress, setIsRemovalInProgress] = useState(false);

    const [removeProductFromWishlistError, setRemoveProductFromWishlistError] = useState(null);

    const [quantity, setQuantity] = useState(1);
    const handleQuantityChange = tempQuantity => {
        setQuantity(tempQuantity);
    };
    
    const cartItem = useMemo(() => {
        const item = {
            quantity,
            sku
        };

        // Merge in additional input variables for configurable items
        if (selectedConfigurableOptions.length && selectedConfigurableOptions.length === configurableOptions.length) {
            const selectedOptionsArray = selectedConfigurableOptions.map(selectedOption => {
                // TODO: Use configurable_product_option_uid for ConfigurableWishlistItem when available in 2.4.5
                const { id: attributeId, value_id: selectedValueId } = selectedOption;
                const configurableOption = configurableOptions.find(option => option.attribute_id_v2 === attributeId);
                const configurableOptionValue = configurableOption.values.find(
                    optionValue => optionValue.value_index === selectedValueId
                );

                return configurableOptionValue.uid;
            });

            Object.assign(item, {
                selected_options: selectedOptionsArray
            });
        }

        return item;
    }, [configurableOptions, selectedConfigurableOptions, sku, quantity]);

    const { addWishlistSimpleProductToCart } = addConfigurableProductToCartFromAdapter({
        cartId: cartId,
        quantity: 1.0,
        sku: item.product.sku,
        parentSku: item.product.orParentSku,
        hasProps: true
    });

    const {
        addWishlistItemToCart,
        error: addWishlistItemToCartError,
        loading: addWishlistItemToCartLoading
    } = addProductToCart({ cartId: cartId, product: cartItem, initialRun: true });

    const { removeProductsFromWishlist } = removeProductsFromWishlistFromAdapter({
        wishlistId: wishlistId,
        wishlistItemsId: [itemId],
        item: item,
        sku: sku,
        isFromUse: true
    });

    const handleAddToCart = useCallback(async () => {
        if (configurableOptions.length === 0 || selectedConfigurableOptions.length === configurableOptions.length) {
            try {
                if (item.product.__typename === 'SimpleProduct') {
                    await addWishlistSimpleProductToCart();
                } else {
                    await addWishlistItemToCart();
                }

                const selectedOptionsLabels =
                    selectedConfigurableOptions?.length > 0
                        ? selectedConfigurableOptions?.map(({ option_label, value_label }) => ({
                            attribute: option_label,
                            value: value_label
                        }))
                        : null;

                dispatch({
                    type: 'CART_ADD_ITEM',
                    payload: {
                        cartId,
                        sku: item.product.sku,
                        name: item.product.name,
                        pricing: item.product.price,
                        priceTotal: item.product.price_range.maximum_price.final_price.value,
                        currencyCode: item.product.price_range.maximum_price.final_price.currency,
                        discountAmount: item.product.price_range.maximum_price.discount.amount_off,
                        selectedOptions: selectedOptionsLabels,
                        quantity: 1
                    }
                });
            } catch (error) {
                console.error(error);
            }
        } else {
            onOpenAddToCartDialog(item);
        }
    }, [
        addWishlistItemToCart,
        addWishlistSimpleProductToCart,
        cartId,
        configurableOptions.length,
        dispatch,
        item,
        onOpenAddToCartDialog,
        selectedConfigurableOptions
    ]);

    const handleRemoveProductFromWishlist = useCallback(async () => {
        try {
            setIsRemovalInProgress(true);
            await removeProductsFromWishlist();
        } catch (e) {
            setIsRemovalInProgress(false);
            console.error(e);
            setRemoveProductFromWishlistError(e);
            if (process.env.NODE_ENV !== 'production') {
                console.error(e);
            }
        }
    }, [removeProductsFromWishlist, setRemoveProductFromWishlistError]);

    const isInStock = stockStatus !== 'OUT_OF_STOCK';
    const addToCartButtonProps = useMemo(() => {
        return {
            disabled: addWishlistItemToCartLoading || !isInStock,
            onClick: handleAddToCart
        };
    }, [addWishlistItemToCartLoading, handleAddToCart, isInStock]);

    const imageProps = useMemo(() => {
        return {
            alt: imageLabel,
            src: imageURL,
            width: 400
        };
    }, [imageLabel, imageURL]);

    return {
        addToCartButtonProps,
        isRemovalInProgress,
        handleRemoveProductFromWishlist,
        hasError: !!addWishlistItemToCartError,
        hasRemoveProductFromWishlistError: !!removeProductFromWishlistError,
        imageProps,
        isSupportedProductType,
        isInStock,
        handleQuantityChange
    };
};

/**
 * JSDoc type definitions
 */

/**
 * GraphQL operations for the Wishlist Item component
 *
 * @typedef {Object} WishlistItemOperations
 *
 * @property {GraphQLDocument} addProductToCartMutation Mutation to add item to the cart
 * @property {GraphQLDocument} removeProductsFromWishlistMutation Mutation to remove a product from a wishlist
 *
 * @see [`wishlistItem.gql.js`]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/WishlistPage/wishlistItem.gql.js}
 * for queries used in Venia
 */

/**
 * Props data to use when rendering the Wishlist Item component
 *
 * @typedef {Object} WishlistItemProps
 *
 * @property {Function} handleRemoveProductFromWishlist Callback to actually remove product from wishlist
 * @property {Boolean} hasError Boolean which represents if there was an error adding the wishlist item to cart
 * @property {Boolean} hasRemoveProductFromWishlistError If there was an error removing a product from the wishlist
 * @property {Boolean} isRemovalInProgress Whether the remove product from wishlist operation is in progress
 * @property {Boolean} isSupportedProductType is this product type suported
 * @property {Boolean} isInStock is product in stock
 */
