import { useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

const SUPPORTED_PRODUCT_TYPES = ['SimpleProduct'];

export const useAddProduct = props => {
    const { addConfigurableProductToCartMutation, productToAdd } = props;

    const productType = productToAdd.__typename;

    const isSupportedProductType = SUPPORTED_PRODUCT_TYPES.includes(
        productType
    );

    const [{ cartId }] = useCartContext();

    const [addConfigurableProductToCart] = useMutation(
        addConfigurableProductToCartMutation
    );

    const handleAddToCart = useCallback(
        async formValues => {
            const { quantity } = formValues;
            const payload = {
                item: productToAdd,
                productType,
                quantity: 1
            };
            if (isSupportedProductType) {
                const variables = {
                    cartId,
                    parentSku: payload.item.orParentSku,
                    product: payload.item,
                    quantity: payload.quantity,
                    sku: payload.item.sku
                };

                if (productType === 'SimpleProduct') {
                    try {
                        await addConfigurableProductToCart({
                            variables
                        });
                    } catch {
                        return;
                    }
                } else if (productType === 'ConfigurableProduct') {
                    return;
                }
            } else {
                console.error('Unsupported product type. Cannot add to cart.');
            }
        },
        [
            addConfigurableProductToCart,
            cartId,
            isSupportedProductType,
            productToAdd,
            productType
        ]
    );

    return {
        handleAddToCart
    };
};
