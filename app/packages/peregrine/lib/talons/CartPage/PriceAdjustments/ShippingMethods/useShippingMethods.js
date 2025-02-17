import { useCallback, useEffect, useState } from 'react';

import { useCartContext } from '../../../../context/cart';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

/**
 * Contains logic for a shipping method selector component.
 * It performs effect and returns props data used to render that component.
 *
 * This talon performs the following effects:
 *
 * - Set the shipping form visibility value based on the shipping methods associated with the cart
 *
 * @function
 *
 * @param {Object} props
 * @param {ShippingMethodsQueries} props.queries GraphQL queries for shipping methods
 *
 * @returns {ShippingMethodsTalonProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useShippingMethods } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/useShippingMethods';
 */
export const useShippingMethods = () => {
    const { getShippingMethods } = useAdapter();

    const [{ cartId }] = useCartContext();

    const { data } = getShippingMethods({ cartId: cartId });

    const [isShowingForm, setIsShowingForm] = useState(false);
    const showForm = useCallback(() => setIsShowingForm(true), []);

    useEffect(() => {
        if (data && data.cart?.shipping_addresses?.length) {
            setIsShowingForm(true);
        }
    }, [data]);

    let selectedShippingFields = {};
    let formattedShippingMethods = [];
    let selectedShippingMethod = null;
    if (data && data.cart && data.cart?.shipping_addresses) {
        const { shipping_addresses: shippingAddresses } = data.cart;

        if (shippingAddresses.length > 0) {
            const primaryShippingAddress = shippingAddresses[0];
            const {
                available_shipping_methods: shippingMethods,
                country,
                postcode,
                region,
                selected_shipping_method: shippingMethod
            } = primaryShippingAddress;

            selectedShippingFields = {
                country: country.code,
                region: region.code,
                zip: postcode
            };

            // GraphQL has some sort order problems when updating the cart.
            // This ensures we're always ordering the result set by price.
            formattedShippingMethods = [...shippingMethods].sort((a, b) => a.amount.value - b.amount.value);

            if (shippingMethod) {
                selectedShippingMethod = `${shippingMethod.carrier_code}|${shippingMethod.method_code}`;
            }
        }
    } else {
        selectedShippingFields = {
            country: '',
            region: '',
            zip: ''
        };
    }

    return {
        hasMethods: formattedShippingMethods.length,
        isShowingForm,
        selectedShippingFields,
        selectedShippingMethod,
        shippingMethods: formattedShippingMethods,
        showForm
    };
};

/** JSDocs type definitions */

/**
 * GraphQL queries for shipping methods.
 * This is a type used in the {@link useShippingMethods} talon.
 *
 * @typedef {Object} ShippingMethodsQueries
 *
 * @property {GraphQLAST} getShippingMethodsQuery Query to get the available shipping methods.
 *
 * @see [shippingMethods.gql.js]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceAdjustments/ShippingMethods/shippingMethods.gql.js}
 * for the queries used in Venia
 */

/**
 * Object type returned by the {@link useShippingMethods} talon.
 * It provides prop data to use when rendering shipping methods.
 *
 * @typedef {Object} ShippingMethodsTalonProps
 *
 * @property {number} hasMethods Provides the number of shipping methods available.
 * Can be used as a boolean value since having no shipping methods would return 0.
 * @property {boolean} isShowingForm True if the form should be shown. False otherwise.
 * @property {SelectShippingFields} selectedShippingFields Values for the select input fields on the shipping form
 * @property {String} selectedShippingMethod A serialized string of <inlineCode>${carrier-code}\|${method-code}</inlineCode>, eg. <inlineCode>usps\|priority</inlineCode>.
 * @property {Array<Object>} shippingMethods A list of available shipping methods based on the primary shipping address
 * @property {function} showForm A function that sets the `isShowingForm` value to true.
 */
