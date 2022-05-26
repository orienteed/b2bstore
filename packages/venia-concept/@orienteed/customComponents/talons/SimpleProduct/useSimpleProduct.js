import { useCallback, useMemo, useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';

import defaultOperations from '@magento/peregrine/lib/talons/Gallery/gallery.gql';

import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { GET_SIMPLE_PRODUCT } from '../SimpleProduct/getSimpleProduct.gql';
import { useLocation } from 'react-router-dom';

const SUPPORTED_PRODUCT_TYPES = ['SimpleProduct'];
export const useSimpleProduct = (props = {}) => {
    const { search } = useLocation();
    const sku = new URLSearchParams(search).get('sku');

    const operations = mergeOperations(defaultOperations, props.operations);
    const { addConfigurableProductToCartMutation } = props;

    const { data, loading, error } = useQuery(GET_SIMPLE_PRODUCT, {
        variables: { sku: sku }
    });

    const { data: storeConfigData } = useQuery(operations.getStoreConfigQuery, {
        fetchPolicy: 'cache-and-network'
    });

    const storeConfig = storeConfigData ? storeConfigData.storeConfig : null;

    const wishlistButtonProps =
        storeConfig && storeConfig.magento_wishlist_general_is_enabled === '1'
            ? {
                  item: {
                      sku: loading ? null : data.products.items[0].sku,
                      quantity: 1
                  },
                  storeConfig
              }
            : null;

    const productType = loading ? null : data.products.items[0].__typename;

    const isSupportedProductType = SUPPORTED_PRODUCT_TYPES.includes(productType);

    const [{ cartId }] = useCartContext();

    const [addConfigurableProductToCart, { error: errorAddingConfigurableProduct }] = useMutation(
        addConfigurableProductToCartMutation
    );

    const handleAddToCart = useCallback(
        async formValues => {
            const { quantity } = formValues;
            const payload = {
                item: loading ? null : data.products.items[0],
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
        [addConfigurableProductToCart, cartId, isSupportedProductType, data, loading, productType]
    );

    const derivedErrorMessage = useMemo(() => deriveErrorMessage([errorAddingConfigurableProduct]), [
        errorAddingConfigurableProduct
    ]);

    return {
        wishlistButtonProps,
        errorMessage: derivedErrorMessage,
        handleAddToCart,
        cartId,
        loading,
        fetchedData: data,
        error
    };
};
