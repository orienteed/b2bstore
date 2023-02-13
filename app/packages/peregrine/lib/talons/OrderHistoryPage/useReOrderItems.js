import { useMutation } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useNoReorderProductContext } from '@magento/venia-ui/lib/components/NoReorderProductProvider/noReorderProductProvider.js';
import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';

const useReOrderItems = ({ order, addConfigurableProductToCartMutation }) => {
	const history = useHistory();
	const { setNoProduct, setLoadingProduct } = useNoReorderProductContext();
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

	const handleReOrderClick = async () => {
		for (let i = 0; i < order.items.length; i++) {
			await handleAddToCart(order.items[i]);
			setLoadingProduct(true);
			window.scroll({ top: 0, left: 0 });
		}
		setLoadingProduct(false);
		history.push('/checkout');
	};

	return {
		isLoading,
		handleReOrderClick
	};
};

export default useReOrderItems;
