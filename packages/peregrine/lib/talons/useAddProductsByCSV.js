import { useCallback, useState, useEffect } from 'react';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { CartTriggerFragment } from '@magento/venia-ui/lib/components/Header/cartTriggerFragments.gql';
import { MiniCartFragment } from '@magento/venia-ui/lib/components/MiniCart/miniCart.gql';
import Papa from 'papaparse';

export const useAddProductsByCSV = props => {
    let {
        setCsvErrorType,
        setCsvSkuErrorList,
        setIsCsvDialogOpen,
        setProducts
    } = props;

    const [{ cartId }] = useCartContext();

    const [
        addConfigurableProductToCart,
        { error: errorAddingSimpleProduct, loading: isAddSimpleLoading }
    ] = useMutation(ADD_CONFIGURABLE_MUTATION);

    const getParentSku = useAwaitQuery(GET_PARENT_SKU);
    const getproduct = useAwaitQuery(GET_PRODUCTS_BY_SKU);

    const handleCSVFile = () => {
        setCsvErrorType('');
        setCsvSkuErrorList([]);
        setIsCsvDialogOpen(false);

        let input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';
        input.onchange = _ => {
            let files = Array.from(input.files);

            if (files.length > 1) alert('Only 1 file is allowed');
            else if (files.length == 1) processCSVFile(files[0]);
        };
        input.click();
    };

    const processCSVFile = file => {
        if (file.name.split('.')[1] !== 'csv') {
            setCsvErrorType('format');
            setIsCsvDialogOpen(true);
        } else {
            Papa.parse(file, {
                complete: function(result) {
                    const dataValidated = formatData(result.data);
                    let res = [];
                    dataValidated.map(async item => {
                        const { data } = await getproduct({
                            variables: { sku: item[0] }
                        });
                        console.log(data, 'datadata');
                        res.push({
                            ...data?.products?.items[0],
                            quantity: item[1]
                        });
                    });
                    setProducts(JSON.parse(JSON.stringify([...res])));
                    // andleAddProductsToCart(dataValidated);
                }
            });
        }
    };

    const formatData = rawData => {
        let dataValidated = [];
        for (let i = 0; i <= rawData.length - 1; i++) {
            if (
                rawData[i][0] != '' &&
                rawData[i][1] != '' &&
                parseInt(rawData[i][1], 10) >= 1 &&
                rawData[i].length == 2
            ) {
                // If SKU appear more than once, exclude it
                if (!dataValidated.map(e => e[0]).includes(rawData[i][0])) {
                    dataValidated.push(rawData[i]);
                }
            } else {
                setCsvErrorType('fields');
                setIsCsvDialogOpen(true);
            }
        }
        return dataValidated;
    };

    const handleAddProductsToCart = useCallback(
        async data => {
            const csvProducts = formatData(data);
            let tempSkuErrorList = [];
            for (let i = 0; i < csvProducts.length; i++) {
                const parentSkuRespon = getParentSku({
                    variables: { sku: csvProducts[i][0] }
                });
                try {
                    const parentSkuResponse = await getParentSku({
                        variables: { sku: csvProducts[i][0] }
                    });
                    const variables = {
                        cartId,
                        quantity: parseInt(csvProducts[i][1], 10),
                        sku: csvProducts[i][0],
                        parentSku:
                            parentSkuResponse.data.products.items[0]
                                .orParentSku || ''
                    };

                    await addConfigurableProductToCart({
                        variables
                    });
                } catch {
                    tempSkuErrorList.push(csvProducts[i][0]);
                    setCsvErrorType('loading');
                    setIsCsvDialogOpen(true);
                }
            }
            if (tempSkuErrorList.length > 0) {
                setCsvErrorType('sku');
                setCsvSkuErrorList(tempSkuErrorList);
            }
        },
        [
            addConfigurableProductToCart,
            cartId,
            setIsCsvDialogOpen,
            setCsvErrorType,
            setCsvSkuErrorList,
            getParentSku
        ]
    );

    return {
        handleCSVFile,
        handleAddProductsToCart
    };
};

export const ADD_CONFIGURABLE_MUTATION = gql`
    mutation addConfigurableProductToCart(
        $cartId: String!
        $quantity: Float!
        $sku: String!
        $parentSku: String!
    ) {
        addConfigurableProductsToCart(
            input: {
                cart_id: $cartId
                cart_items: [
                    {
                        data: { quantity: $quantity, sku: $sku }
                        parent_sku: $parentSku
                    }
                ]
            }
        ) @connection(key: "addConfigurableProductsToCart") {
            cart {
                id
                # Update the cart trigger when adding an item.
                ...CartTriggerFragment
                # Update the mini cart when adding an item.
                ...MiniCartFragment
            }
        }
    }
    ${CartTriggerFragment}
    ${MiniCartFragment}
`;

export const GET_PARENT_SKU = gql`
    query getParentSku($sku: String) {
        products(search: $sku, filter: { sku: { eq: $sku } }) {
            items {
                uid
                orParentSku
            }
        }
    }
`;
export const GET_PRODUCTS_BY_SKU = gql`
    query getproduct($sku: String!) {
        # Limit results to first three.
        products(search: $sku) {
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            items {
                id
                uid
                name
                sku
                price {
                    regularPrice {
                        amount {
                            value
                            currency
                        }
                    }
                }
            }
            total_count
        }
    }
`;
