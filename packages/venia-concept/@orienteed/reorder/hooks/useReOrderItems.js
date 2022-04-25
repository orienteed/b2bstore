import { useMemo, useCallback, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
const storage = new BrowserPersistence();

// GraphQL mutation to fetch a reorderitems
const RE_ORDER_ITEMS = gql`
    mutation reorderItems($orderNumber: String!) {
        reorderItems(orderNumber: $orderNumber) {
            cart {
                id
            }
        }
    }
`;

const useReOrderItems = props => {
    const history = useHistory();

    const [isLoading, setIsLoading] = useState(false);

    // Reorder Data
    const [reOrderItems, { data }] = useMutation(RE_ORDER_ITEMS);
    useMemo(() => {
        if (data && data.reorderItems && data.reorderItems.cart) {
            storage.setItem('cartId', data.reorderItems.cart.id);
        }
    }, [history, data]);

    const handleReOrderClick = useCallback(
        async orderNumber => {
            setIsLoading(true);
            await reOrderItems({
                variables: {
                    orderNumber: orderNumber
                }
            });

            await history.push('/checkout');
        },
        [reOrderItems, setIsLoading]
    );

    return {
        isLoading,
        handleReOrderClick
    };
};
export default useReOrderItems;
