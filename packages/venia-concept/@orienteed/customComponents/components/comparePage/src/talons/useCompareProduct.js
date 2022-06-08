import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useToasts } from '@magento/peregrine';

const useCompareProduct = () => {
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();
    const [isLoading, setIsLoading] = useState(false);

    const getCompareProducts = () => {
        setIsLoading(true);
        const products = JSON.parse(localStorage.getItem('compare_products')) || [];
        setIsLoading(false);
        return products;
    };

    const addProductsToCompare = product => {
        const { sku } = product;
        let products = getCompareProducts();
        let isAdded = checkProduct(sku);
        if (!isAdded) {
            localStorage.setItem('compare_products', JSON.stringify([...products, product]));
            addToast({
                type: 'success',
                message: formatMessage({
                    id: 'item.addTOcompare',
                    defaultMessage: 'The product  was added to compare products'
                })
            });
        }
    };

    const checkProduct = productSku => {
        let products = getCompareProducts();
        let item = products?.find(({ sku }) => sku === productSku) || null;
        return item ? true : false;
    };

    const productsItems = useMemo(() => getCompareProducts(), [localStorage.compare_products]);
    return {
        productsItems,
        addProductsToCompare,
        getCompareProducts,
        isLoading
    };
};

export default useCompareProduct;
