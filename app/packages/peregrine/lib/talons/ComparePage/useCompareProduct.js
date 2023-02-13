import { useLazyQuery, useMutation } from '@apollo/client';
import { useToasts } from '@magento/peregrine';
import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import { CREATE_COMPARE_LIST, DELETE_PRODUCTS_FROM_LIST, GET_COMPARE_LIST_CUSTOMER } from './compareRequest.gql';

const useCompareProduct = () => {
	const { formatMessage } = useIntl();
	const [, { addToast }] = useToasts();
	const [isLoading, setIsLoading] = useState(false);
	const [isAction, setIsAction] = useState(false);
	const [createCompareList] = useMutation(CREATE_COMPARE_LIST);
	const [deleteProductsFromList] = useMutation(DELETE_PRODUCTS_FROM_LIST);
	const [getCustomerCompareList, { data, loading }] = useLazyQuery(GET_COMPARE_LIST_CUSTOMER, {
		fetchPolicy: 'cache-and-network',
		nextFetchPolicy: 'cache-first'
	});

	const deleteProduct = async item => {
		await deleteProductsFromList({
			variables: {
				uid: data?.customer?.compare_list?.uid,
				products: [item.uid]
			}
		});
		setIsAction(!isAction);
		addToast({
			type: 'success',
			message: formatMessage({
				id: 'compareProducts.deletecompareProducts',
				defaultMessage: 'The product was deleted from compare products list'
			}),
			timeout: 7000
		});
	};

	const productsItems = useMemo(() => {
		return (data && data?.customer?.compare_list) || [];
	}, [data]);

	const productsCount = useMemo(() => {
		return data?.customer?.compare_list?.item_count || 0;
	}, [data]);
	useEffect(() => {
		getCustomerCompareList();
		setIsLoading(loading);
	}, [getCustomerCompareList, isAction, loading]);

	const addProductsToCompare = async product => {
		const { id } = product;
		await createCompareList({
			variables: {
				products: [id]
			}
		});
		addToast({
			type: 'success',
			message: formatMessage({
				id: 'compareProducts.addTocompare',
				defaultMessage: 'The product was added to compare products'
			}),
			timeout: 7000
		});
		setIsAction(!isAction);
	};

	return {
		productsItems: productsItems,
		addProductsToCompare,
		deleteProduct,
		productsCount,
		isLoading
	};
};

export default useCompareProduct;
