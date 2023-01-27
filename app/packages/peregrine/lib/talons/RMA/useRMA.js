/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { useToasts } from '@magento/peregrine';
import { useIntl } from 'react-intl';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';

import {
    MP_RMA_CONFIG,
    MP_RMA_REQUEST,
    RMA_REQUEST_LIST,
    GET_CUSTOMER_ORDERS,
    MPCANCEL_RMA_REQUEST,
    GET_CUSTOMER,
    GET_PRODUCT_ID
} from './RMA.gql';

const useRMA = () => {
    const { push } = useHistory();
    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);
    const [dropzoneError, setDropzoneError] = useState('');
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();

    const [comment, setComment] = useState('');
    const [returnType, setReturnType] = useState('allItems');
    const [returnTypes, setReturnTypes] = useState([
        {
            label: 'All Items',
            value: 'allItems'
        },
        { label: 'Each Items', value: 'eachItems' }
    ]);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [filesUploaded, setFilesUploaded] = useState([]);
    const [additionalField, setAdditionalField] = useState([]);
    const [formAddress] = useState();
    const [orderId, setOrderId] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);

    const { data: reasonSolutionAdditionalFieldData } = useQuery(MP_RMA_CONFIG, { fetchPolicy: 'no-cache' });
    const { data: requestsList, refetch } = useQuery(RMA_REQUEST_LIST, { fetchPolicy: 'no-cache' });
    const { data: customersOrders } = useQuery(GET_CUSTOMER_ORDERS);
    const { data: customerData } = useQuery(GET_CUSTOMER);
    const getProductBySku = useAwaitQuery(GET_PRODUCT_ID);
    const [createMpRmaRequest, { loading }] = useMutation(MP_RMA_REQUEST);
    const [cancelMpRmaRequest] = useMutation(MPCANCEL_RMA_REQUEST);
    console.log('selectedItems', selectedItems);
    const formProps = {
        initialValues: formAddress
    };

    const selectTitle = formatMessage({
        id: '"deliveryDate.pleaseSelect',
        defaultMessage: 'Please select one'
    });

    const customerOrderIds = useMemo(() => {
        const handleCustomerOrderIds = () => {
            const orderIds = customersOrders?.customer?.orders?.items.map(item => {
                return {
                    value: item.number
                };
            });

            if (orderIds) return [{ value: selectTitle }, ...orderIds];
        };
        return handleCustomerOrderIds();
    }, [customersOrders?.customer?.orders?.items, selectTitle]);

    const customerOrders = useMemo(() => {
        const handleCustomerOrderItem = () => {
            const customerOrderItems = customersOrders?.customer?.orders?.items.filter(item => {
                return item.number === orderId;
            });
            const orderItems = customerOrderItems?.map(item => {
                return item?.items?.map(p => {
                    return {
                        product_id: p.id,
                        name: p.product_name,
                        SKU: p.product_sku,
                        qty_rma: p.quantity_ordered,
                        price: p.product_sale_price,
                        additional_fields: []
                    };
                });
            });

            const flattenOrderItems = orderItems?.flat();
            return flattenOrderItems;
        };
        return handleCustomerOrderItem();
    }, [customersOrders?.customer?.orders?.items, orderId]);

    const handleChangeOrderId = val => {
        setOrderId(val);
        setSelectedItems([]);
        setSelectedItems([]);
    };

    const handleSelectItem = useCallback(item => {
        setSelectedItems(prev => {
            if (prev.length > 0) {
                const existingItem = prev.find(a => a.SKU === item.SKU);

                if (existingItem) setSelectedItems(prev => prev.filter(b => b.SKU !== item.SKU));
            }

            return [...prev, item];
        });
    }, []);

    const handleEachItemChange = (e, productId, type, addFieldValue) => {
        if (selectedItems.length > 0) {
            const newSelectedItems = [...selectedItems];
            console.log({ productId, newSelectedItems }, newSelectedItems.find(a => a.product_id === productId));
            newSelectedItems.find(a => a.product_id === productId)[type] = e.target.value;
            setSelectedItems(newSelectedItems);

            if (type !== 'solution' && type !== 'reason') {
                let newSelectedAdditionalFields = newSelectedItems.find(a => a.product_id === productId)
                    .additional_fields;
                if (newSelectedAdditionalFields.find(field => field.value === addFieldValue)) {
                    newSelectedAdditionalFields.find(field => field.value === addFieldValue)[type] = e.target.value;
                } else {
                    newSelectedAdditionalFields = [
                        ...newSelectedAdditionalFields,
                        {
                            value: addFieldValue,
                            content: e.target.value
                        }
                    ];
                }
                newSelectedItems.find(a => a.product_id === productId).additional_fields = [
                    ...newSelectedAdditionalFields
                ];
                setSelectedItems(newSelectedItems);
            }
        }
        return e.target.value;
    };
    console.log('selectedItems', selectedItems);

    const handleAdditionalFieldChange = (e, keyContent, addFieldValue) => {
        const newAdditionalField = [...additionalField];

        if (newAdditionalField.find(a => a.value === addFieldValue)) {
            newAdditionalField.find(a => a.value === addFieldValue)['content'] = e.target.value;
            setAdditionalField(newAdditionalField);
        } else {
            setAdditionalField(prev => [...prev, { content: e.target.value, value: addFieldValue }]);
        }
    };

    const handleReasonSolutionChange = e => {
        return e.target.value;
    };

    const infoReasonsData = useMemo(() => {
        const handleInfoReasonsData = () => {
            const reasonsData = reasonSolutionAdditionalFieldData?.mpRMAConfig?.reason.map(a => {
                return {
                    content: a.content,
                    value: a.value
                };
            });
            if (reasonsData) return [{ value: selectTitle }, ...reasonsData];
        };
        return handleInfoReasonsData();
    }, [reasonSolutionAdditionalFieldData?.mpRMAConfig?.reason, selectTitle]);

    const infoSolutionData = useMemo(() => {
        const handleInfoSolutionData = () => {
            const reasonsData = reasonSolutionAdditionalFieldData?.mpRMAConfig?.solution.map(a => {
                return {
                    content: a.content,
                    value: a.value
                };
            });
            if (reasonsData) return [{ value: selectTitle }, ...reasonsData];
        };
        return handleInfoSolutionData();
    }, [reasonSolutionAdditionalFieldData?.mpRMAConfig?.solution, selectTitle]);

    const getproductId = async sku => {
        return await getProductBySku({
            variables: {
                inputText: sku
            },
            fetchPolicy: 'no-cache'
        });
    };

    const handleSubmit = useCallback(
        async apiValue => {
            try {
                const items = [];
                (returnType === 'allItems' ? customerOrders : selectedItems).map(
                    async ({ content, product_id, price, name, qty_rma, SKU, ...rest }, index) => {
                        await getproductId(SKU).then(async data => {
                            if (data.length === 0) return null;
                            await items.push({
                                product_id: data?.data.products?.items[0].id,
                                reason: returnType === 'allItems' ? apiValue.reason : null,
                                solution: returnType === 'allItems' ? apiValue.solution : null,
                                ...rest
                            });
                        });
                        if ((returnType === 'allItems' ? customerOrders : selectedItems).length - 1 === index) {
                            createMpRmaRequest({
                                variables: {
                                    order_increment_id: apiValue.selection,
                                    comment: apiValue.comment,
                                    // statusId: 1,
                                    // upload: filesUploaded,
                                    request_item: items,
                                    reason: apiValue.reason,
                                    solution: apiValue.solution,
                                    additional_fields: additionalField
                                }
                            });
                            addToast({
                                type: 'success',
                                message: formatMessage({
                                    id: 'rmaRequestForm.addedSuccessfully',
                                    defaultMessage: 'Item successfully added to your RMA list'
                                }),
                                timeout: 7000
                            });
                        }
                    }
                );
            } catch (error) {
                console.log({ error });
            }
        },
        [customerOrders, returnType, createMpRmaRequest, selectedItems, additionalField]
    );

    const handleClose = file => {
        const newFilesUploaded = [...filesUploaded].filter(({ name }) => name != file.name);
        setFilesUploaded(newFilesUploaded);
    };

    const handleReturnChange = e => setReturnType(e.target.value);

    const submitCancelRmaRequest = async data => {
        try {
            await cancelMpRmaRequest({
                variables: {
                    request_id: data
                }
            });
            refetch();
        } catch (err) {
            console.log({ err }, 'err');
        }
    };
    const handleRedirectCreateRMA = () => push('/rma/form');

    const handleCancel = ({ request_id }) => submitCancelRmaRequest(request_id);

    return {
        handleSubmit,
        filesUploaded,
        setFilesUploaded,
        setIsEmojiPickerOpen,
        dropzoneError,
        setDropzoneError,
        isEmojiPickerOpen,
        comment,
        setComment,
        formProps,
        handleClose,
        returnTypes,
        handleReturnChange,
        setFormApi,
        handleEachItemChange,
        handleRedirectCreateRMA,
        returnType,
        handleCancel,
        requestsList: requestsList?.customer?.mp_rma,
        customersOrders,
        orderId,
        handleChangeOrderId,
        customerOrderIds,
        customerOrders,
        selectedItems,
        setSelectedItems,
        handleSelectItem,
        infoReasonsData,
        infoSolutionData,
        customerData,
        handleReasonSolutionChange,
        reasonSolutionAdditionalFieldData,
        handleAdditionalFieldChange,
        refetchRequest: refetch
    };
};

export default useRMA;

// const returnTypes = [
//     {
//         label: 'All Items',
//         value: 'allItems'
//     },
//     { label: 'Each Items', value: 'eachItems' }
// ];
