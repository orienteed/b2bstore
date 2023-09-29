/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo } from 'react';
import { useMutation } from '@apollo/client';
import { useIntl } from 'react-intl';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useLocation } from 'react-router-dom';

import { useUserContext } from '../../../context/user';
import { useModulesContext } from '../../../context/modulesProvider';
import { useStoreConfigContext } from '../../../context/storeConfigProvider';
import { useAdapter } from '../../../hooks/useAdapter';

const SUPPORTED_PRODUCT_TYPES = ['SimpleProduct'];

export const useSimpleProduct = (props = {}) => {
    const { addConfigurableProductToCartMutation, productQuantity } = props;
    const { formatMessage } = useIntl();
    const { search } = useLocation();
    const [{ isSignedIn }] = useUserContext();
    const { tenantConfig } = useModulesContext();

    const sku = new URLSearchParams(search).get('sku');
    const isB2B = tenantConfig.b2bProductDetailView;

    // BIGCOMMERCE ADAPTER
    // Obtain operations from adapter
    const { getSimpleProduct } = useAdapter();

    // Fetch product data from BigCommerce
    const { data, loading, error } = getSimpleProduct({
        sku: sku,
        includeProductAlert: tenantConfig?.productAlertEnabled,
        includeProductAttachment: tenantConfig?.productAttachmentEnabled
    });
    // END BIGCOMMERCE ADAPTER

    const { data: storeConfigData, refetch } = useStoreConfigContext();

    const wishlistItemOptions = useMemo(() => {
        const options = {
            quantity: 1,
            sku: loading || !data ? 'No sku' : data.products.items[0].sku
        };

        return options;
    }, [data, loading]);

    useEffect(() => {
        if (isSignedIn) refetch();
    }, [isSignedIn]);

    const wishlistButtonProps = {
        buttonText: isSelected =>
            isSelected
                ? formatMessage({
                      id: 'wishlistButton.addedText',
                      defaultMessage: 'Added to Favorites'
                  })
                : formatMessage({
                      id: 'wishlistButton.addText',
                      defaultMessage: 'Add to Favorites'
                  }),
        item: wishlistItemOptions,
        storeConfig: storeConfigData ? storeConfigData.storeConfig : {}
    };

    const productType = loading || !data ? 'Simple product' : data.products.items[0].__typename || 'Simple product';

    const isSupportedProductType = SUPPORTED_PRODUCT_TYPES.includes(productType);

    const [{ cartId }] = useCartContext();

    const [
        addConfigurableProductToCart,
        { error: errorAddingConfigurableProduct, loading: isAddConfigurableLoading }
    ] = useMutation(addConfigurableProductToCartMutation);

    const handleAddToCart = useCallback(async () => {
        const payload = {
            item: loading || !data ? [] : data.products.items[0],
            productType,
            quantity: productQuantity
        };

        if (isSupportedProductType) {
            const variables = {
                cartId,
                parentSku: payload.item.length < 1 ? 'No sku' : payload.item.orParentSku,
                product: payload.item,
                quantity: payload.quantity,
                sku: payload.item.length < 1 ? 'No sku' : payload.item.sku
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
    }, [addConfigurableProductToCart, cartId, isSupportedProductType, data, loading, productType, productQuantity]);

    const derivedErrorMessage = useMemo(() => deriveErrorMessage([errorAddingConfigurableProduct]), [
        errorAddingConfigurableProduct
    ]);

    return {
        wishlistButtonProps,
        errorMessage: derivedErrorMessage,
        handleAddToCart,
        cartId,
        loading,
        fetchedData: !data ? null : data,
        error,
        isB2B,
        isAddConfigurableLoading
    };
};
