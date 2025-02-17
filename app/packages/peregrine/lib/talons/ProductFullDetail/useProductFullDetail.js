import { useCallback, useState, useMemo, useEffect } from 'react';
import { useIntl } from 'react-intl';

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useEventingContext } from '../../context/eventing';
import { useStoreConfigContext } from '../../context/storeConfigProvider';
import { useUserContext } from '@magento/peregrine/lib/context/user';

import { appendOptionsToPayload } from '@magento/peregrine/lib/util/appendOptionsToPayload';
import { deriveErrorMessage } from '../../util/deriveErrorMessage';
import { findMatchingVariant } from '@magento/peregrine/lib/util/findMatchingProductVariant';
import { getOutOfStockVariants } from '@magento/peregrine/lib/util/getOutOfStockVariants';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';
import { isSupportedProductType as isSupported } from '@magento/peregrine/lib/util/isSupportedProductType';
import { useToasts } from '@magento/peregrine';

import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

import { useModulesContext } from '../../context/modulesProvider';

const INITIAL_OPTION_CODES = new Map();
const INITIAL_OPTION_SELECTIONS = new Map();
const OUT_OF_STOCK_CODE = 'OUT_OF_STOCK';
const IN_STOCK_CODE = 'IN_STOCK';

const deriveOptionCodesFromProduct = product => {
    // If this is a simple product it has no option codes.
    if (!isProductConfigurable(product)) {
        return INITIAL_OPTION_CODES;
    }

    // Initialize optionCodes based on the options of the product.
    const initialOptionCodes = new Map();
    for (const { attribute_id, attribute_code } of product.configurable_options) {
        initialOptionCodes.set(attribute_id, attribute_code);
    }

    return initialOptionCodes;
};

// Similar to deriving the initial codes for each option.
const deriveOptionSelectionsFromProduct = product => {
    if (!isProductConfigurable(product)) {
        return INITIAL_OPTION_SELECTIONS;
    }

    const initialOptionSelections = new Map();
    for (const { attribute_id } of product.configurable_options) {
        initialOptionSelections.set(attribute_id, undefined);
    }

    return initialOptionSelections;
};

const getIsMissingOptions = (product, optionSelections) => {
    // Non-configurable products can't be missing options.
    if (!isProductConfigurable(product)) {
        return false;
    }

    // Configurable products are missing options if we have fewer
    // option selections than the product has options.
    const { configurable_options } = product;
    const numProductOptions = configurable_options.length;
    const numProductSelections = Array.from(optionSelections.values()).filter(value => !!value).length;

    return numProductSelections < numProductOptions;
};

const getHasOptionsOfTheSelection = (product, optionCodes, optionSelections) => {
    const { variants } = product;
    const item = findMatchingVariant({
        optionCodes,
        optionSelections,
        variants
    });

    return item != null;
};

const getIsOutOfStock = (product, optionCodes, optionSelections) => {
    const { stock_status, variants } = product;
    const isConfigurable = isProductConfigurable(product);
    const optionsSelected = Array.from(optionSelections.values()).filter(value => !!value).length > 0;

    if (isConfigurable && optionsSelected) {
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        const stockStatus = item?.product?.stock_status;

        return stockStatus === OUT_OF_STOCK_CODE || !stockStatus;
    }
    return stock_status === OUT_OF_STOCK_CODE;
};

const getIsOutOfStockProduct = product => {
    const { variants } = product;

    const outOfStockVariants = [];

    for (let index = 0; index < variants.length; index++) {
        if (variants[index].product.stock_status === 'OUT_OF_STOCK') {
            outOfStockVariants.push(variants[index]);
        }
    }

    return outOfStockVariants;
};
const getIsAllOutOfStock = product => {
    const { stock_status, variants } = product;
    const isConfigurable = isProductConfigurable(product);

    if (isConfigurable) {
        const inStockItem = variants.find(item => {
            return item.product.stock_status === IN_STOCK_CODE;
        });
        return !inStockItem;
    }
    return stock_status === OUT_OF_STOCK_CODE;
};

const getMediaGalleryEntries = (product, optionCodes, optionSelections) => {
    let value = [];
    const { media_gallery_entries, variants } = product;
    const isConfigurable = isProductConfigurable(product);
    const newOptions = deriveOptionCodesFromProduct(product);
    // Selections are initialized to "code => undefined". Once we select a value, like color, the selections change. This filters out unselected options.
    const optionsSelected = Array.from(optionSelections.values()).filter(value => !!value).length > 0;
    if (!isConfigurable || !optionsSelected) {
        value = media_gallery_entries;
    } else {
        // If any of the possible variants matches the selection add that
        // variant's image to the media gallery. NOTE: This _can_, and does,
        // include variants such as size. If Magento is configured to display
        // an image for a size attribute, it will render that image.
        const item = findMatchingVariant({
            optionCodes: newOptions,
            optionSelections,
            variants
        });

        value = item ? [...item.product.media_gallery_entries, ...media_gallery_entries] : media_gallery_entries;
    }

    return value;
};

// We only want to display breadcrumbs for one category on a PDP even if a
// product has multiple related categories. This function filters and selects
// one category id for that purpose.
const getBreadcrumbCategoryId = categories => {
    // Exit if there are no categories for this product.
    if (!categories || !categories.length) {
        return;
    }
    const breadcrumbSet = new Set();
    categories.forEach(({ breadcrumbs }) => {
        // breadcrumbs can be `null`...
        (breadcrumbs || []).forEach(({ category_id }) => breadcrumbSet.add(category_id));
    });

    // Until we can get the single canonical breadcrumb path to a product we
    // will just return the first category id of the potential leaf categories.
    const leafCategory = categories?.find(category => !breadcrumbSet.has(category.uid));

    // If we couldn't find a leaf category then just use the first category
    // in the list for this product.
    return leafCategory.uid || categories[0].uid;
};

const getConfigPriceRegular = (product, optionCodes, optionSelections) => {
    let value;

    const { variants } = product;
    const isConfigurable = isProductConfigurable(product);

    const optionsSelected = Array.from(optionSelections.values()).filter(value => !!value).length > 0;

    if (!isConfigurable || !optionsSelected) {
        value = product.price.regularPrice.amount;
    } else {
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        value = item ? item.product.price.regularPrice.amount : product.price.regularPrice.amount;
    }

    return value;
};

const getConfigPriceMinimal = (product, optionCodes, optionSelections) => {
    let value;

    const { variants } = product;
    const isConfigurable = isProductConfigurable(product);

    const optionsSelected = Array.from(optionSelections.values()).filter(value => !!value).length > 0;

    if (!isConfigurable || !optionsSelected) {
        value = product.price.minimalPrice.amount;
    } else {
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        value = item ? item.product.price.minimalPrice.amount : product.price.minimalPrice.amount;
    }

    return value;
};

const attributeLabelCompare = (attribute1, attribute2) => {
    const label1 = attribute1['attribute_metadata']['label'].toLowerCase();
    const label2 = attribute2['attribute_metadata']['label'].toLowerCase();
    if (label1 < label2) return -1;
    else if (label1 > label2) return 1;
    else return 0;
};

const getCustomAttributes = (product, optionCodes, optionSelections) => {
    const { custom_attributes, variants } = product;
    const isConfigurable = isProductConfigurable(product);
    const optionsSelected = Array.from(optionSelections.values()).filter(value => !!value).length > 0;

    if (isConfigurable && optionsSelected) {
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        return item && item.product ? [...item.product.custom_attributes].sort(attributeLabelCompare) : [];
    }

    return custom_attributes ? [...custom_attributes].sort(attributeLabelCompare) : [];
};

/**
 * @param {GraphQLDocument} props.addConfigurableProductToCartMutation - configurable product mutation
 * @param {GraphQLDocument} props.addSimpleProductToCartMutation - configurable product mutation
 * @param {Object.<string, GraphQLDocument>} props.operations - collection of operation overrides merged into defaults
 * @param {Object} props.product - the product, see RootComponents/Product
 *
 * @returns {{
 *  breadcrumbCategoryId: string|undefined,
 *  errorMessage: string|undefined,
 *  handleAddToCart: func,
 *  handleSelectionChange: func,
 *  handleSetQuantity: func,
 *  isAddToCartDisabled: boolean,
 *  isSupportedProductType: boolean,
 *  mediaGalleryEntries: array,
 *  productDetails: object,
 *  quantity: number
 * }}
 */
export const useProductFullDetail = props => {
    const { addConfigurableProductToCartMutation, addSimpleProductToCartMutation, product } = props;
    const [, { dispatch }] = useEventingContext();
    const [, { addToast }] = useToasts();
    const hasDeprecatedOperationProp = !!(addConfigurableProductToCartMutation || addSimpleProductToCartMutation);

    const {
        addConfigurableProductToCart: addConfigurableProductToCartFromAdapter,
        addProductToCart: addProductToCartFromAdapter,
        addSimpleProductToCart: addSimpleProductToCartFromAdapter
    } = useAdapter();

    const productType = product.__typename;

    const isSupportedProductType = isSupported(productType);

    const { tenantConfig } = useModulesContext();

    const isB2B = tenantConfig.b2bProductDetailView;

    const [{ cartId }] = useCartContext();
    const [{ isSignedIn }] = useUserContext();
    const { formatMessage } = useIntl();

    const { data: storeConfigData } = useStoreConfigContext();

    const { addConfigurableProductToCart,
        error: errorAddingConfigurableProduct,
        loading: isAddConfigurableLoading
    } = addConfigurableProductToCartFromAdapter({ hasProps: false });

    const {
        addSimpleProductToCart,
        error: errorAddingSimpleProduct,
        loading: isAddSimpleLoading
    } = addSimpleProductToCartFromAdapter();

    const {
        addProductToCart,
        error: errorAddingProductToCart,
        loading: isAddProductLoading
    } = addProductToCartFromAdapter({ initialRun: false });

    const breadcrumbCategoryId = useMemo(() => getBreadcrumbCategoryId(product.categories), [product.categories]);

    const derivedOptionSelections = deriveOptionSelectionsFromProduct(product);

    const [optionSelections, setOptionSelections] = useState(derivedOptionSelections);
    const [singleOptionSelection, setSingleOptionSelection] = useState();

    const derivedOptionCodes = useMemo(() => deriveOptionCodesFromProduct(product), [product]);
    const [optionCodes, setOptionCode] = useState(derivedOptionCodes);
    useEffect(() => {
        setOptionCode(derivedOptionCodes);
    }, [derivedOptionCodes]);

    const isMissingOptions = useMemo(() => getIsMissingOptions(product, optionSelections), [product, optionSelections]);

    const hasOptionsOfTheSelection = useMemo(
        () => getHasOptionsOfTheSelection(product, optionCodes, optionSelections),
        [product, optionCodes, optionSelections]
    );
    const isSimpleProductSelected = useMemo(() => !Array.from(optionSelections.values()).includes(undefined), [
        optionSelections
    ]);

    const isOutOfStock = useMemo(() => getIsOutOfStock(product, optionCodes, optionSelections), [
        product,
        optionCodes,
        optionSelections
    ]);

    const isOutOfStockProduct = useMemo(() => getIsOutOfStockProduct(product), [product]);

    const isOutOfStockProductDisplayed = useMemo(() => {
        let totalVariants = 1;
        const isConfigurable = isProductConfigurable(product);
        if (product.configurable_options && isConfigurable) {
            for (const option of product.configurable_options) {
                const length = option.values.length;
                totalVariants = totalVariants * length;
            }
            return product.variants.length === totalVariants;
        }
    }, [product]);

    const isEverythingOutOfStock = useMemo(() => getIsAllOutOfStock(product), [product]);

    const outOfStockVariants = useMemo(
        () =>
            getOutOfStockVariants(
                product,
                optionCodes,
                singleOptionSelection,
                optionSelections,
                isOutOfStockProductDisplayed
            ),
        [product, optionCodes, singleOptionSelection, optionSelections, isOutOfStockProductDisplayed]
    );
    const mediaGalleryEntries = useMemo(
        () => getMediaGalleryEntries(product, optionCodes, optionSelections, derivedOptionSelections),
        [product, optionCodes, optionSelections, derivedOptionSelections]
    );
    const customAttributes = useMemo(() => getCustomAttributes(product, optionCodes, optionSelections), [
        product,
        optionCodes,
        optionSelections
    ]);

    // The map of ids to values (and their uids)
    // For example:
    // { "179" => [{ uid: "abc", value_index: 1 }, { uid: "def", value_index: 2 }]}
    const attributeIdToValuesMap = useMemo(() => {
        const map = new Map();
        // For simple items, this will be an empty map.
        const options = product.configurable_options || [];
        for (const { attribute_id, values } of options) {
            map.set(attribute_id, values);
        }
        return map;
    }, [product.configurable_options]);

    // An array of selected option uids. Useful for passing to mutations.
    // For example:
    // ["abc", "def"]
    const selectedOptionsArray = useMemo(() => {
        const selectedOptions = [];

        optionSelections.forEach((value, key) => {
            const values = attributeIdToValuesMap.get(key);

            const selectedValue = values?.find(item => item.value_index === value);

            if (selectedValue) {
                selectedOptions.push(selectedValue.uid);
            }
        });
        return selectedOptions;
    }, [attributeIdToValuesMap, optionSelections]);
    const handleAddToCart = useCallback(
        async formValues => {
            const { quantity } = formValues;
            if (hasDeprecatedOperationProp) {
                const payload = {
                    item: product,
                    productType,
                    quantity
                };

                if (isProductConfigurable(product)) {
                    appendOptionsToPayload(payload, optionSelections, optionCodes);
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
                        try {
                            await addConfigurableProductToCart({
                                variables
                            });
                        } catch {
                            return;
                        }
                    }
                } else {
                    console.error('Unsupported product type. Cannot add to cart.');
                }
            } else {
                const variables = {
                    cartId,
                    product: {
                        sku: product.sku,
                        quantity
                    },
                    entered_options: [
                        {
                            uid: product.uid,
                            value: product.name
                        }
                    ]
                };

                if (selectedOptionsArray.length) {
                    variables.product.selected_options = selectedOptionsArray;
                }

                try {
                    await addProductToCart({ variables }).then(() => {
                        addToast({
                            type: 'success',
                            message: formatMessage({
                                id: 'cartPage.AddedSuccessfully',
                                defaultMessage: 'Added to cart successfully.'
                            }),
                            timeout: 6000
                        });
                        const selectedOptionsLabels =
                            selectedOptionsArray?.map((uid, i) => ({
                                attribute: product.configurable_options[i].label,
                                value:
                                    product.configurable_options[i].values.findLast(x => x.uid === uid)?.label || null
                            })) || null;

                        dispatch({
                            type: 'CART_ADD_ITEM',
                            payload: {
                                cartId,
                                sku: product.sku,
                                name: product.name,
                                selectedOptions: selectedOptionsLabels,
                                quantity
                            }
                        });
                    });
                } catch {
                    return;
                }
            }
        },
        [
            addConfigurableProductToCart,
            addProductToCart,
            addSimpleProductToCart,
            cartId,
            dispatch,
            hasDeprecatedOperationProp,
            isSupportedProductType,
            optionCodes,
            optionSelections,
            product,
            productType,
            selectedOptionsArray
        ]
    );
    const derivedOptionSelectionsKey = Array.from(derivedOptionSelections.keys());

    const handleSelectionChange = useCallback(
        (optionId, selection) => {
            const optionSelectionsKeys1 = Array.from(optionSelections.keys());
            const derivedOptionSelectionsKeys1 = Array.from(derivedOptionSelections.keys());

            if (!derivedOptionSelectionsKeys1.every(ele => optionSelectionsKeys1.includes(ele))) {
                const newOptionSelections = new Map([...derivedOptionSelections]);
                newOptionSelections.set(optionId, selection);
                return setOptionSelections(newOptionSelections);
            }
            // We must create a new Map here so that React knows that the value
            // of optionSelections has changed.
            const nextOptionSelections = new Map([...optionSelections]);
            nextOptionSelections.set(optionId, selection);
            setOptionSelections(nextOptionSelections);
            // Create a new Map to keep track of single selections with key as String
            const nextSingleOptionSelection = new Map();
            nextSingleOptionSelection.set(optionId, selection);
            setSingleOptionSelection(nextSingleOptionSelection);
        },
        [optionSelections, derivedOptionSelections]
    );

    const productPriceRegular = useMemo(() => getConfigPriceRegular(product, optionCodes, optionSelections), [
        product,
        optionCodes,
        optionSelections
    ]);

    const productPriceMinimal = useMemo(() => getConfigPriceMinimal(product, optionCodes, optionSelections), [
        product,
        optionCodes,
        optionSelections
    ]);

    // Normalization object for product details we need for rendering.
    const productDetails = {
        description: product.description,
        name: product.name,
        price: {
            regularPrice: {
                amount: productPriceRegular
            },
            minimalPrice: {
                amount: productPriceMinimal
            }
        },
        sku: product.sku,
        mp_attachments: product.mp_attachments
    };

    const derivedErrorMessage = useMemo(
        () => deriveErrorMessage([errorAddingSimpleProduct, errorAddingConfigurableProduct, errorAddingProductToCart]),
        [errorAddingConfigurableProduct, errorAddingProductToCart, errorAddingSimpleProduct]
    );

    const wishlistItemOptions = useMemo(() => {
        const options = {
            quantity: 1,
            sku: product.sku
        };

        if (productType === 'ConfigurableProduct') {
            options.selected_options = selectedOptionsArray;
        }

        return options;
    }, [product, productType, selectedOptionsArray]);

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

    const selectedVarient = useMemo(() => {
        const allKeysHaveDefinedValues = ![...optionSelections.entries()].some(([, value]) => value === undefined);

        if (allKeysHaveDefinedValues) {
            const item = findMatchingVariant({
                optionCodes,
                optionSelections,
                variants: product.variants
            });
            return item;
        }
        return;
    }, [optionSelections, optionCodes, product]);

    return {
        breadcrumbCategoryId,
        errorMessage: derivedErrorMessage,
        handleAddToCart,
        handleSelectionChange,
        isOutOfStock,
        isEverythingOutOfStock,
        outOfStockVariants,
        isAddToCartDisabled:
            isOutOfStock ||
            isEverythingOutOfStock ||
            isMissingOptions ||
            isAddConfigurableLoading ||
            isAddSimpleLoading ||
            isAddProductLoading ||
            !hasOptionsOfTheSelection,
        isSupportedProductType,
        mediaGalleryEntries,
        shouldShowWishlistButton:
            isSignedIn && storeConfigData && !!storeConfigData.storeConfig.magento_wishlist_general_is_enabled,
        productDetails,
        customAttributes,
        wishlistButtonProps,
        wishlistItemOptions,
        hasOptionsOfTheSelection,
        addConfigurableProductToCart,
        isAddConfigurableLoading,
        cartId,
        derivedOptionSelectionsKey,
        isSimpleProductSelected,
        isB2B,
        selectedVarient,
        isOutOfStockProduct
    };
};
