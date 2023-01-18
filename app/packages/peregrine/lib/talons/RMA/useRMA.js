import { useState, useRef, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { FormattedMessage, useIntl } from 'react-intl';
import {
    MP_RMA_CONFIG,
    MP_RMA_REQUEST,
    RMA_REQUEST_LIST,
    GET_CUSTOMER_ORDERS,
    MPCANCEL_RMA_REQUEST,
    GET_CUSTOMER
} from './RMA.gql';

const useRMA = () => {
    const { push } = useHistory();
    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);
    const [dropzoneError, setDropzoneError] = useState('');
    const { formatMessage } = useIntl();

    const [comment, setComment] = useState('');
    const [returnType, setReturnType] = useState('allItems');
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [filesUploaded, setFilesUploaded] = useState([]);
    const [formAddress] = useState();

    const { data: reasonSolutionAdditionalFieldData } = useQuery(MP_RMA_CONFIG);
    const { data: requestsList, refetch } = useQuery(RMA_REQUEST_LIST);
    const { data: customersOrders } = useQuery(GET_CUSTOMER_ORDERS);
    const { data: customerData } = useQuery(GET_CUSTOMER);

    const selectTitle = formatMessage({
        id: 'rmaRequestForm.select',
        defaultMessage: 'Select'
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

    const [orderId, setOrderId] = useState('');

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
                        price: p.product_sale_price
                    };
                });
            });

            const flattenOrderItems = orderItems?.flat();
            return flattenOrderItems;
        };
        return handleCustomerOrderItem();
    }, [customersOrders?.customer?.orders?.items, orderId]);

    const [selectedItems, setSelectedItems] = useState([]);
    console.log('selectedItem', selectedItems);
    const [createMpRmaRequest, { data, loading, error }] = useMutation(MP_RMA_REQUEST);
    const [cancelMpRmaRequest] = useMutation(MPCANCEL_RMA_REQUEST);
    const formProps = {
        initialValues: formAddress
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

    const handleEachItemChange = (e, productId, type) => {
        if (selectedItems.length > 0) {
            const newSelectedItems = [...selectedItems];
            newSelectedItems.find(a => a.product_id === productId)[type] = e.target.value;

            setSelectedItems(newSelectedItems);
        }
        return e.target.value;
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

    const handleSubmit = useCallback(async apiValue => {
        console.log(apiValue, 'apiValue');
        // try {
        //     createMpRmaRequest({
        //         variables: {
        //             order_increment_id: apiValue.selection,
        //             comment: apiValue.comment,
        //             statusId: 1,
        //             upload: filesUploaded,
        //             request_item: returnType === 'allItems' ? customerOrders : selectedItems,
        //             reason: apiValue.reason,
        //             solution: apiValue.solution,
        //             additional_fields: []
        //         }
        //     });
        // } catch (error) {
        //     throw new Error('Something went wrong');
        // }
    }, []);
    const handleClose = file => {
        const newFilesUploaded = [...filesUploaded].filter(({ name }) => name != file.name);
        setFilesUploaded(newFilesUploaded);
    };

    const handleReturnChange = e => setReturnType(e.target.value);

    const submitCancelRmaRequest = async data => {
        console.log(data, 'request_id');
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
        setOrderId,
        customerOrderIds,
        customerOrders,
        selectedItems,
        setSelectedItems,
        handleSelectItem,
        infoReasonsData,
        infoSolutionData,
        customerData,
        handleReasonSolutionChange
    };
};

export default useRMA;

const returnTypes = [
    {
        label: 'All Items',
        value: 'allItems'
    },
    { label: 'Each Items', value: 'eachItems' }
];
