/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useStoreConfigContext } from '@magento/peregrine/lib/context/storeConfigProvider';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

import { useEventingContext } from '../../../context/eventing';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useModulesContext } from '../../../context/modulesProvider';
/**
 * A [React Hook]{@link https://reactjs.org/docs/hooks-intro.html} that
 * controls the logic for the Product Root Component.
 *
 * @kind function
 *
 * @param {object}      props
 * @param {Function}    props.mapProduct - A function for updating products to the proper shape.
 * @param {GraphQLAST}  props.queries.getStoreConfigData - Fetches storeConfig product url suffix using a server query
 * @param {GraphQLAST}  props.queries.getProductQuery - Fetches product using a server query
 *
 * @returns {object}    result
 * @returns {Bool}      result.error - Indicates a network error occurred.
 * @returns {Bool}      result.loading - Indicates the query is in flight.
 * @returns {Bool}      result.product - The product's details.
 */
export const useProduct = props => {
    const { mapProduct } = props;

    const { tenantConfig } = useModulesContext();

    const { getProductDetailForProductPageByUrlKey } = useAdapter();

    const { pathname } = useLocation();
    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();

    const [{ isSignedIn }] = useUserContext();
    const { data: storeConfigData } = useStoreConfigContext();

    const slug = pathname.split('/').pop();
    const productUrlSuffix = storeConfigData?.storeConfig?.product_url_suffix;
    const urlKey = productUrlSuffix ? slug.replace(productUrlSuffix, '') : slug;

    const { error, loading, data, refetch } = getProductDetailForProductPageByUrlKey({
        urlKey: urlKey,
        storeConfigData: storeConfigData,
        includeProductAlert: tenantConfig?.productAlertEnabled,
        includeProductAttachment: tenantConfig?.productAttachmentEnabled
    });

    const isBackgroundLoading = !!data && loading;

    const product = useMemo(() => {
        if (!data) {
            // The product isn't in the cache and we don't have a response from GraphQL yet.
            return null;
        }

        // Note: if a product is out of stock _and_ the backend specifies not to
        // display OOS items, the items array will be empty.

        // Only return the product that we queried for.
        const product = data.products.items.find(item => item.url_key === urlKey);

        if (!product) {
            return null;
        }

        return mapProduct(product);
    }, [data, mapProduct, urlKey]);

    const [, { dispatch }] = useEventingContext();

    // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(isBackgroundLoading);
    }, [isBackgroundLoading, setPageLoading]);

    useEffect(() => {
        if (!error && !loading && product) {
            dispatch({
                type: 'PRODUCT_PAGE_VIEW',
                payload: {
                    id: product.id,
                    name: product.name,
                    sku: product.sku,
                    currency_code: product?.price_range?.maximum_price?.final_price?.currency,
                    price_range: {
                        maximum_price: {
                            final_price: product?.price_range?.maximum_price?.final_price?.value
                        }
                    },
                    url_key: product.url_key
                }
            });
        }
    }, [error, loading, product, dispatch]);

    useEffect(() => {
        if (isSignedIn) refetch();
    }, [isSignedIn]);

    return {
        error,
        loading,
        product
    };
};
