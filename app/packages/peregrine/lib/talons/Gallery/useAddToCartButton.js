import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';

import { useCartContext } from '../../context/cart';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import resourceUrl from '../../util/makeUrl';

import DEFAULT_OPERATIONS from '../QuickOrderForm/quickOrderForm.gql';
import PRODUCT_OPERATIONS from '../ProductFullDetail/productFullDetail.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
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
    const isHomePage = location.pathname === '/';

    const { item, urlSuffix, quantity, setIsConfigurableProductUnselected } = props;
    const operations = mergeOperations(DEFAULT_OPERATIONS, PRODUCT_OPERATIONS, props.operations);
    const { addConfigurableProductToCartMutation, getParentSkuBySkuQuery } = operations;

    const [isLoading, setIsLoading] = useState(false);

    const getParentSku = useAwaitQuery(getParentSkuBySkuQuery);

    const isInStock = item.stock_status === 'IN_STOCK';
    const productType = item.__typename;
    const isUnsupportedProductType = UNSUPPORTED_PRODUCT_TYPES.includes(productType);
    const isDisabled =
        isLoading || !isInStock || isUnsupportedProductType || item.price?.regularPrice?.amount?.value === -1;
    const history = useHistory();

    const [{ cartId }] = useCartContext();

    const [addConfigurableProductToCart] = useMutation(addConfigurableProductToCartMutation);

    const handleAddToCart = useCallback(async () => {
        try {
            if (productType === 'SimpleProduct') {
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
                if (!isHomePage) {
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
                } else if (isHomePage) {
                    const productLink = resourceUrl(`/${item.url_key}${urlSuffix || ''}`);
                    history.push(productLink);
                }
            } else {
                console.warn('Unsupported product type unable to handle.');
            }
        } catch (err) {
            console.error('Failed to add product to cart', err);
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
