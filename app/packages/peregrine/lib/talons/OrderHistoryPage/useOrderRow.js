import { useCallback, useState, useMemo } from 'react';

import { useStoreConfigContext } from '@magento/peregrine/lib/context/storeConfigProvider';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

/**
 * @function
 *
 * @param {Object} props
 * @param {Array<Object>} props.items Collection of items in Order
 * @param {OrderRowOperations} props.operations GraphQL queries for the Order Row Component
 *
 * @returns {OrderRowTalonProps}
 */
export const useOrderRow = props => {
    const [ticketModal, setTicketModal] = useState(false);

    const { items } = props;

    const { getProductThumbnailsByUrlKey } = useAdapter();

    const urlKeys = useMemo(() => {
        return items.map(item => item.product_url_key).sort();
    }, [items]);

    const { data, loading } = getProductThumbnailsByUrlKey({ urlKeys: urlKeys });

    const { data: storeConfigData } = useStoreConfigContext();

    const configurableThumbnailSource = useMemo(() => {
        if (storeConfigData) {
            return storeConfigData.storeConfig.configurable_thumbnail_source;
        }
    }, [storeConfigData]);

    const imagesData = useMemo(() => {
        if (data) {
            // Images data is taken from simple product or from configured variant and assigned to item sku
            const mappedImagesData = {};
            items.forEach(item => {
                const product = data.products.items.find(element => item.product_url_key === element.url_key);
                if (
                    configurableThumbnailSource === 'itself' &&
                    product &&
                    product.variants &&
                    product.variants.length > 0
                ) {
                    const foundVariant = product.variants.find(variant => {
                        return variant.product.sku === item.product_sku;
                    });
                    mappedImagesData[item.product_sku] = foundVariant ? foundVariant.product : product;
                } else {
                    mappedImagesData[item.product_sku] = product;
                }
            });

            return mappedImagesData;
        } else {
            return {};
        }
    }, [data, items, configurableThumbnailSource]);

    const [isOpen, setIsOpen] = useState(false);

    const handleContentToggle = useCallback(() => {
        setIsOpen(currentValue => !currentValue);
    }, []);

    const openOrderIncidenceModal = () => {
        setTicketModal(true);
    };

    return {
        loading,
        imagesData,
        isOpen,
        handleContentToggle,
        openOrderIncidenceModal,
        setTicketModal,
        ticketModal
    };
};

/**
 * JSDoc type definitions
 */

/**
 * GraphQL operations for the Order Row Component
 *
 * @typedef {Object} OrderRowOperations
 *
 * @property {GraphQLAST} getProductThumbnailsQuery The query used to get product thumbnails of items in the Order.
 *
 * @see [`orderRow.gql.js`]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/OrderHistoryPage/orderRow.gql.js}
 * for queries used in Venia
 */

/**
 * Props data to use when rendering a collapsed image gallery
 *
 * @typedef {Object} OrderRowTalonProps
 *
 * @property {Object} imagesData Images data with thumbnail URLs to render.
 * @property {Boolean} isOpen Boolean which represents if a row is open or not
 * @property {Function} handleContentToggle Callback to toggle isOpen value
 */
