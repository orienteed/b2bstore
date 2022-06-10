import { useMemo, useState, useEffect } from 'react';
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

    const [productsItems, setProductsItems] = useState([]);
   

    useEffect(() => {
        setProductsItems(getCompareProducts());
    }, []);

    const addProductsToCompare = product => {
        const { sku } = product;
        let products = getCompareProducts();
        let isAdded = checkProduct(sku);
        if (!isAdded) {
            let newProducts = [...products, product];
            localStorage.setItem('compare_products', JSON.stringify(newProducts));
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

    // const productsItems = useMemo(() => getCompareProducts(), [localStorage.compare_products]);

    const deleteProduct = skuProduct => {
        let products = getCompareProducts();
        let newItems = products.filter(({ sku }) => skuProduct !== sku);
        localStorage.setItem('compare_products', JSON.stringify(newItems));
        setProductsItems(newItems);
    };
    return {
        productsItems,
        addProductsToCompare,
        getCompareProducts,
        deleteProduct,
        isLoading
    };
};

export default useCompareProduct;
