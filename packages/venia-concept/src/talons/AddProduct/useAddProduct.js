import { useCallback, useMemo } from 'react';
import { useMutation } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { appendOptionsToPayload } from '@magento/peregrine/lib/util/appendOptionsToPayload';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';

const getBreadcrumbCategoryId = categories => {
    if (!categories || !categories.length) {
        return;
    }
    const breadcrumbSet = new Set();
    categories.forEach(({ breadcrumbs }) => {
        (breadcrumbs || []).forEach(({ category_id }) => breadcrumbSet.add(category_id));
    });

    const leafCategory = categories.find(category => !breadcrumbSet.has(category.id));

    return leafCategory.id || categories[0].id;
};

const SUPPORTED_PRODUCT_TYPES = ['SimpleProduct'];

export const useAddProduct = props => {
    const { addConfigurableProductToCartMutation, addSimpleProductToCartMutation, suggested_Product } = props;

    const productType = suggested_Product.__typename;

    const isSupportedProductType = SUPPORTED_PRODUCT_TYPES.includes(productType);

    const [{ cartId }] = useCartContext();

    const [
        addConfigurableProductToCart,
        { error: errorAddingConfigurableProduct, loading: isAddConfigurableLoading }
    ] = useMutation(addConfigurableProductToCartMutation);

    const [addSimpleProductToCart, { error: errorAddingSimpleProduct, loading: isAddSimpleLoading }] = useMutation(
        addSimpleProductToCartMutation
    );

    const breadcrumbCategoryId = useMemo(() => getBreadcrumbCategoryId(suggested_Product.categories), [
        suggested_Product.categories
    ]);

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

    return {
        handleAddToCart
    };
};
