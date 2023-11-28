import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useCartContext } from '../../context/cart';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';
import resourceUrl from '../../util/makeUrl';

import { useToasts } from '../../Toasts';
import { useIntl } from 'react-intl';

/**
 * @param {String} props.item.uid - uid of item
 * @param {String} props.item.name - name of item
 * @param {String} props.item.stock_status - stock status of item
 * @param {String} props.item.__typename - product type
 * @param {String} props.item.url_key - item url key
 * @param {String} props.item.sku - item sku
 *
 * @returns {
 *      handleAddToCart: Function,
 *      isDisabled: Boolean,
 *      isInStock: Boolean
 * }
 *
 */
const UNSUPPORTED_PRODUCT_TYPES = ['VirtualProduct', 'BundleProduct', 'GroupedProduct', 'DownloadableProduct'];

export const useAddToCartButton = props => {
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const { location } = useHistory();
    const isNotSelectablePage = location.pathname === '/' || 'compare_products';

    const { item, urlSuffix, quantity, setIsConfigurableProductUnselected } = props;

    const [isLoading, setIsLoading] = useState(false);

    const { getParentSkuBySku, addConfigurableProductToCart: addConfigurableProductToCartFromAdapter } = useAdapter();
    const { getParentSku } = getParentSkuBySku();

    const isInStock = item.stock_status === 'IN_STOCK';
    const productType = item.__typename;
    const isUnsupportedProductType = UNSUPPORTED_PRODUCT_TYPES.includes(productType);
    const isDisabled =
        isLoading || !isInStock || isUnsupportedProductType || item.price?.regularPrice?.amount?.value === -1;
    const history = useHistory();

    const [{ cartId }] = useCartContext();

    const { addConfigurableProductToCart } = addConfigurableProductToCartFromAdapter({ hasProps: false });

    const handleAddToCart = useCallback(async () => {
        try {
            if (productType === 'SimpleProduct') {
                if(!quantity){
                    addToast({
                        type: 'error',
                        message: formatMessage({
                            id: 'cartPage.ConfigurableProductPutQuantity',
                            defaultMessage: 'Please insert a product quantity.'
                        }),
                        timeout: 6000
                    });
                    return;
                }
                setIsLoading(true);

                const parentSkuResponse = await getParentSku({
                    variables: { sku: item.sku }
                });

                const parentSku = parentSkuResponse.data.products.items[0].orParentSku;

                await addConfigurableProductToCart({
                    variables: {
                        cartId,
                        quantity: quantity || 1,
                        sku: item.sku,
                        parentSku: item.parentSku || parentSku
                    }
                });
                setIsLoading(false);
                addToast({
                    type: 'success',
                    message: formatMessage({
                        id: 'cartPage.AddedSuccessfully',
                        defaultMessage: 'Added to cart successfully.'
                    }),
                    timeout: 6000
                });
            } else if (productType === 'ConfigurableProduct') {
                if (!isNotSelectablePage) {
                    setIsConfigurableProductUnselected(false);
                    addToast({
                        type: 'error',
                        message: formatMessage({
                            id: 'cartPage.ConfigurableProductSelectionRequired',
                            defaultMessage: 'Please select an item.'
                        }),
                        timeout: 6000
                    });
                    return;
                } else if (isNotSelectablePage) {
                    const productLink = resourceUrl(`/${item.url_key}${urlSuffix || ''}`);
                    history.push(productLink);
                }
            } else {
                console.warn('Unsupported product type unable to handle.');
            }
        } catch (err) {
            console.error('Failed to add product to cart', err);
            setIsLoading(false);
            addToast({
                type: 'error',
                message: formatMessage({
                    id: 'cartPage.AddedFailure',
                    defaultMessage: 'Failed to add an item to cart.'
                }),
                timeout: 6000
            });
        }
    }, [
        addConfigurableProductToCart,
        cartId,
        getParentSku,
        history,
        item.parentSku,
        item.sku,
        item.url_key,
        productType,
        quantity,
        urlSuffix,
        setIsConfigurableProductUnselected
    ]);

    return {
        handleAddToCart,
        isDisabled,
        isInStock,
        setIsConfigurableProductUnselected
    };
};
