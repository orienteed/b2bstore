import { useCallback, useState, useMemo } from 'react';
import { useMutation } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import { appendOptionsToPayload } from '@magento/peregrine/lib/util/appendOptionsToPayload';
import { findMatchingVariant } from '@magento/peregrine/lib/util/findMatchingProductVariant';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';

// const INITIAL_OPTION_CODES = new Map();
// const INITIAL_OPTION_SELECTIONS = new Map();

// const deriveOptionCodesFromProduct = product => {

//     if (!isProductConfigurable(product)) {
//         return INITIAL_OPTION_CODES;
//     }

//     const initialOptionCodes = new Map();
//     for (const {
//         attribute_id,
//         attribute_code
//     } of product.configurable_options) {
//         initialOptionCodes.set(attribute_id, attribute_code);
//     }

//     return initialOptionCodes;
// };

// const deriveOptionSelectionsFromProduct = product => {
//     if (!isProductConfigurable(product)) {
//         return INITIAL_OPTION_SELECTIONS;
//     }

//     const initialOptionSelections = new Map();
//     for (const { attribute_id } of product.configurable_options) {
//         initialOptionSelections.set(attribute_id, undefined);
//     }

//     return initialOptionSelections;
// };

// const getIsMissingOptions = (product, optionSelections) => {

//     if (!isProductConfigurable(product)) {
//         return false;
//     }

//     const { configurable_options } = product;
//     const numProductOptions = configurable_options.length;
//     const numProductSelections = Array.from(optionSelections.values()).filter(
//         value => !!value
//     ).length;

//     return numProductSelections < numProductOptions;
// };

// const getMediaGalleryEntries = (product, optionCodes, optionSelections) => {
//     let value = [];

//     const { media_gallery_entries, variants } = product;
//     const isConfigurable = isProductConfigurable(product);

//     const optionsSelected =
//         Array.from(optionSelections.values()).filter(value => !!value).length >
//         0;

//     if (!isConfigurable || !optionsSelected) {
//         value = media_gallery_entries;
//     } else {

//         const item = findMatchingVariant({
//             optionCodes,
//             optionSelections,
//             variants
//         });

//         value = item
//             ? [...item.product.media_gallery_entries, ...media_gallery_entries]
//             : media_gallery_entries;
//     }

//     return value;
// };

const getBreadcrumbCategoryId = categories => {
    if (!categories || !categories.length) {
        return;
    }
    const breadcrumbSet = new Set();
    categories.forEach(({ breadcrumbs }) => {
        (breadcrumbs || []).forEach(({ category_id }) =>
            breadcrumbSet.add(category_id)
        );
    });

    const leafCategory = categories.find(
        category => !breadcrumbSet.has(category.id)
    );

    return leafCategory.id || categories[0].id;
};

// const getConfigPrice = (product, optionCodes, optionSelections) => {
//     let value;

//     const { variants } = product;
//     const isConfigurable = isProductConfigurable(product);

//     const optionsSelected =
//         Array.from(optionSelections.values()).filter(value => !!value).length >
//         0;

//     if (!isConfigurable || !optionsSelected) {
//         value = product.price.regularPrice.amount;
//     } else {
//         const item = findMatchingVariant({
//             optionCodes,
//             optionSelections,
//             variants
//         });

//         value = item
//             ? item.product.price.regularPrice.amount
//             : product.price.regularPrice.amount;
//     }

//     return value;
// };

const SUPPORTED_PRODUCT_TYPES = ['SimpleProduct'];

// /**
//  * @param {GraphQLQuery} props.addConfigurableProductToCartMutation - configurable suggested_Productmutation
//  * @param {GraphQLQuery} props.addSimpleProductToCartMutation - configurable suggested_Productmutation
//  * @param {Object} props.suggested_Product- the product, see RootComponents/Product
//  *
//  * @returns {{
//  *  breadcrumbCategoryId: string|undefined,
//  *  errorMessage: string|undefined,
//  *  handleAddToCart: func,
//  *  handleSelectionChange: func,
//  *  handleSetQuantity: func,
//  *  isAddToCartDisabled: boolean,
//  *  mediaGalleryEntries: array,
//  *  productDetails: object,
//  *  quantity: number
//  * }}
//  */
export const useAddProduct = props => {
    const {
        addConfigurableProductToCartMutation,
        addSimpleProductToCartMutation,
        suggested_Product
    } = props;

    const productType = suggested_Product.__typename;

    const isSupportedProductType = SUPPORTED_PRODUCT_TYPES.includes(
        productType
    );

    const [{ cartId }] = useCartContext();

    const [
        addConfigurableProductToCart,
        {
            error: errorAddingConfigurableProduct,
            loading: isAddConfigurableLoading
        }
    ] = useMutation(addConfigurableProductToCartMutation);

    const [
        addSimpleProductToCart,
        { error: errorAddingSimpleProduct, loading: isAddSimpleLoading }
    ] = useMutation(addSimpleProductToCartMutation);

    const breadcrumbCategoryId = useMemo(
        () => getBreadcrumbCategoryId(suggested_Product.categories),
        [suggested_Product.categories]
    );

    // const derivedOptionSelections = useMemo(
    //     () => deriveOptionSelectionsFromProduct(suggested_Product),
    //     [suggested_Product]
    // );

    // const [optionSelections, setOptionSelections] = useState(
    //     derivedOptionSelections
    // );

    // const derivedOptionCodes = useMemo(
    //     () => deriveOptionCodesFromProduct(suggested_Product),
    //     [suggested_Product]
    // );
    // const [optionCodes] = useState(derivedOptionCodes);

    // const isMissingOptions = useMemo(
    //     () => getIsMissingOptions(suggested_Product, optionSelections),
    //     [suggested_Product, optionSelections]
    // );
    // const mediaGalleryEntries = useMemo(
    //     () => getMediaGalleryEntries(suggested_Product, optionCodes, optionSelections),
    //     [suggested_Product, optionCodes, optionSelections]
    // );

    const handleAddToCart = useCallback(
        async formValues => {
            const { quantity } = formValues;
            const payload = {
                item: suggested_Product,
                productType,
                quantity: 1
            };

            if (isProductConfigurable(suggested_Product)) {
                appendOptionsToPayload(payload);
            }

            if (isSupportedProductType) {
                const variables = {
                    cartId,
                    parentSku: payload.parentSku,
                    product: payload.item,
                    quantity: payload.quantity,
                    sku: payload.item.sku
                };

                // Use the proper mutation for the type.
                if (productType === 'SimpleProduct') {
                    try {
                        await addSimpleProductToCart({
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
            addSimpleProductToCart,
            cartId,
            isSupportedProductType,
            suggested_Product,
            productType
        ]
    );
    // const handleSelectionChange = useCallback(
    //     (optionId, selection) => {

    //         const nextOptionSelections = new Map([...optionSelections]);
    //         nextOptionSelections.set(optionId, selection);
    //         setOptionSelections(nextOptionSelections);
    //     },
    //     [optionSelections]
    // );

    // const productPrice = useMemo(
    //     () => getConfigPrice(suggested_Product, optionCodes, optionSelections),
    //     [suggested_Product, optionCodes, optionSelections]
    // );

    // const productDetails = {
    //     description: suggested_Product.description,
    //     name: suggested_Product.name,
    //     price: productPrice,
    //     sku: suggested_Product.sku
    // };

    // const derivedErrorMessage = useMemo(
    //     () =>
    //         deriveErrorMessage([
    //             errorAddingSimpleProduct,
    //             errorAddingConfigurableProduct
    //         ]),
    //     [errorAddingConfigurableProduct, errorAddingSimpleProduct]
    // );

    return {
        handleAddToCart
    };
};
