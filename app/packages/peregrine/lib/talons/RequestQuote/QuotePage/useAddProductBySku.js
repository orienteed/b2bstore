import { useCallback, useState, useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { AFTER_UPDATE_MY_QUOTE } from '../useQuoteCartTrigger';
import { setQuoteId } from '../Store';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

export const useAddProductBySku = () => {
    const { getProductsDetailsForQuoteBySearch, addSimpleProductsToQuote } = useAdapter();

    const [products, setProducts] = useState([]);
    const [isFatching, setIsFatching] = useState(false);

    // SimpleProduct Mutation
    const { addSimpleProductToQuote } = addSimpleProductsToQuote();

    // Prepare to run the queries.
    const { runSearch, productResult } = getProductsDetailsForQuoteBySearch();

    const debouncedRunQuery = useMemo(
        () =>
            debounce(inputText => {
                runSearch({ variables: { search: inputText } });
            }, 500),
        [runSearch]
    );

    // Add Simple Product
    const handleAddItemBySku = useCallback(
        async productSku => {
            const variables = {
                input: {
                    cart_items: [
                        {
                            data: {
                                sku: productSku,
                                quantity: 1
                            }
                        }
                    ]
                }
            };

            const {
                data: {
                    addSimpleProductsToMpQuote: { quote }
                }
            } = await addSimpleProductToQuote({
                variables
            });
            await setQuoteId(quote.entity_id);
            await window.dispatchEvent(new CustomEvent(AFTER_UPDATE_MY_QUOTE, { detail: quote }));
        },
        [addSimpleProductToQuote]
    );

    useEffect(() => {
        if (productResult.data != undefined) {
            const { data } = productResult;
            if (data.products) {
                const {
                    products: { items }
                } = data;
                setProducts(items);
            }
        }
        setIsFatching(false);
    }, [productResult]);

    const handleSearchData = useCallback(async () => {
        setProducts([]);
        const searchField = document.querySelector('#searchProduct').value;
        if (searchField.length > 2) {
            setIsFatching(true);
            // Get Products
            await debouncedRunQuery(searchField);
        }
    }, [debouncedRunQuery]);

    return {
        products,
        isFatching,
        handleAddItemBySku,
        handleSearchData
    };
};
