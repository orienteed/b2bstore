import { useState, useCallback } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useNoReorderProductContext } from '@orienteed/customComponents/components/NoReorderProductProvider/noReorderProductProvider';

const storage = new BrowserPersistence();

// GraphQL mutation to fetch a reorderitems
const RE_ORDER_ITEMS = gql`
    mutation reOrderItems($orderNumber: String!) {
        reorderItems(orderNumber: $orderNumber) {
            cart {
                id
            }
        }
    }
`;

const useReOrderItems = ({ order, config, addConfigurableProductToCartMutation }) => {
    const history = useHistory();
    const { setNoProduct } = useNoReorderProductContext();
    const [isLoading, setIsLoading] = useState(false);
    const [{ cartId }] = useCartContext();

    const [addConfigurableProductToCart] = useMutation(
        addConfigurableProductToCartMutation || operations.addConfigurableProductToCartMutation
    );

    const handleAddToCart = useCallback(
        async product => {
            const variables = {
                cartId,
                parentSku: product.product_name,
                quantity: product.quantity_ordered,
                sku: product.product_sku
            };

            try {
                await addConfigurableProductToCart({
                    variables
                });
            } catch (error) {
                if (error) return setNoProduct(true);
            }
        },
        [addConfigurableProductToCart, cartId, setNoProduct]
    );

    // Reorder Data
    const [reOrderItems, { data, loading }] = useMutation(RE_ORDER_ITEMS);

    const handleReOrderClick = async orderNumber => {
        if (loading) return null;
        if (order.store_id == config?.storeConfig?.id) {
            await reOrderItems({
                variables: {
                    orderNumber: orderNumber
                }
            });
            if (data) storage.setItem('cartId', data.reorderItems.cart.id);
            history.push('/checkout');
            location.reload();
        } else {
            for (let i = 0; i < order.items.length; i++) {
                handleAddToCart(order.items[i]);
            }

            history.push('/checkout');
        }
    };

    return {
        isLoading,
        handleReOrderClick
    };
};

export default useReOrderItems;
