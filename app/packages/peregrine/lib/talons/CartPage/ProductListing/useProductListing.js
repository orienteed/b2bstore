import { useEffect, useState } from 'react';

import { useCartContext } from '../../../context/cart';
import { useStoreConfigContext } from '../../../context/storeConfigProvider';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

/**
 * This talon contains logic for a component that renders a list of products for a cart.
 * It performs effects and returns prop data to render the component on a cart page.
 *
 * This talon performs the following effects:
 *
 * - Fetch product listing data associated with the cart
 * - Log any GraphQL errors to the console
 *
 * @function
 *
 * @param {Object} props
 * @param {ProductListingQueries} props.queries GraphQL queries for getting product listing data.
 *
 * @returns {ProductListingTalonProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useProductListing } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useProductListing';
 */
export const useProductListing = () => {
    const { getProductListing } = useAdapter();

    const [{ cartId }] = useCartContext();
    const [activeEditItem, setActiveEditItem] = useState(null);

    const { fetchProductListing, called, data, error, loading } = getProductListing();

    const { data: storeConfigData } = useStoreConfigContext();
    const wishlistConfig = storeConfigData ? storeConfigData.storeConfig : {};

    useEffect(() => {
        if (cartId) {
            fetchProductListing({
                variables: {
                    cartId
                }
            });
        }
    }, [cartId, fetchProductListing]);

    let items = [];
    if (called && !loading) {
        items = data?.cart?.items || [];
    }

    return {
        activeEditItem,
        isLoading: !!loading,
        error,
        items,
        setActiveEditItem,
        wishlistConfig
    };
};

/** JSDocs type definitions */

/**
 * GraphQL queries for getting product listing data.
 * This is a type used in the {@link useProductListing} talon.
 *
 * @typedef {Object} ProductListingQueries
 *
 * @property {GraphQLDocument} getProductListingQuery Query to get the product list for a cart
 *
 * @see [productListingFragments.js]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/ProductListing/productListingFragments.js}
 * for the queries used in Venia
 */

/**
 * Object type returned by the {@link useProductListing} talon.
 * It provides props data for a component that renders a product list.
 *
 * @typedef {Object} ProductListingTalonProps
 *
 * @property {Object} activeEditItem The product item currently being edited
 * @property {boolean} isLoading True if the query to get the product listing is still in progress. False otherwise.
 * @property {Error|null} error An array of graphql errors
 * @property {Array<Object>} items A list of products in a cart
 * @property {function} setActiveEditItem Function for setting the current item to edit
 *
 */
