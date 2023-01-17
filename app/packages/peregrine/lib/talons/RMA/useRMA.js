import { useState, useRef, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { MP_RMA_CONFIG, MP_RMA_REQUEST, RMA_REQUEST_LIST, GET_CUSTOMER_ORDERS, MPCANCEL_RMA_REQUEST } from './RMA.gql';

const useRMA = () => {
    const { push } = useHistory();
    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);
    const [dropzoneError, setDropzoneError] = useState('');

    const [comment, setComment] = useState('');
    const [returnType, setReturnType] = useState('allItems');
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [filesUploaded, setFilesUploaded] = useState([]);
    const [formAddress] = useState();

    const { data: reasonSolutionAdditionalFieldData } = useQuery(MP_RMA_CONFIG);
    const { data: requestsList, refetch } = useQuery(RMA_REQUEST_LIST);
    const { data: customersOrders } = useQuery(GET_CUSTOMER_ORDERS);

    const customerOrderIds = useMemo(() => {
        const handleCustomerOrderIds = () => {
            const orderIds = customersOrders?.customer?.orders?.items.map(item => {
                return {
                    value: item.number
                };
            });
            return orderIds;
        };
        return handleCustomerOrderIds();
    }, [customersOrders?.customer?.orders?.items]);

    const [orderId, setOrderId] = useState('');

    const customerOrders = useMemo(() => {
        const handleCustomerOrderItem = () => {
            const customerOrderItems = customersOrders?.customer?.orders?.items.filter(item => {
                if (!orderId) return item.number === customerOrderIds?.[0].value;

                return item.number === orderId;
            });
            const orderItems = customerOrderItems?.map(item => {
                return item?.items?.map(p => {
                    return {
                        name: p.product_name,
                        SKU: p.product_sku,
                        qty: p.quantity_ordered,
                        price: p.product_sale_price
                    };
                });
            });

            const flattenOrderItems = orderItems?.flat();
            return flattenOrderItems;
        };
        return handleCustomerOrderItem();
    }, [customerOrderIds, customersOrders?.customer?.orders?.items, orderId]);

    const [selectedItems, setSelectedItems] = useState([]);

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

    console.log('uploaded', filesUploaded);

    const handleSubmit = useCallback(
        async apiValue => {
            console.log(apiValue, 'apiValue');
            try {
                createMpRmaRequest({
                    variables: {
                        order_increment_id: orderId,
                        comment: apiValue.comment,
                        statusId: 1,
                        upload: filesUploaded,
                        request_item: returnType === 'allItems' ? customerOrders : selectedItems,
                        reason: apiValue.reason,
                        solution: apiValue.solution,
                        additional_fields: []
                    }
                });
            } catch (error) {
                throw new Error('Something went wrong');
            }
        },
        [createMpRmaRequest, customerOrders, filesUploaded, orderId, returnType, selectedItems]
    );
    const handleClose = file => {
        const newFilesUploaded = [...filesUploaded].filter(({ name }) => name != file.name);
        setFilesUploaded(newFilesUploaded);
    };

    const handleReturnChange = e => setReturnType(e.target.value);

    const handleReasonChange = (e, product, type) => {
        console.log(e.target, product, type, '(e, product, type) ');
    };

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
        reasons,
        soluations,
        order,
        handleReasonChange,
        handleRedirectCreateRMA,
        returnType,
        handleCancel,
        reasonSolutionAdditionalFieldData,
        requestsList: requestsList?.customer?.mp_rma,
        customersOrders,
        orderId,
        setOrderId,
        customerOrderIds,
        customerOrders,
        selectedItems,
        setSelectedItems,
        handleSelectItem
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

const reasons = [
    {
        label: 'I order the wronge item',
        value: 'wrongeItem'
    },
    { label: 'I am concernd about privacy', value: 'privacy' }
];

const soluations = [
    {
        label: 'We will review you request',
        value: 'request'
    },
    { label: 'Change the shipping address in edit', value: 'shippingAddress' }
];

const order = {
    products: [
        {
            name: 'Table',
            SKU: 'Table',
            price: 22.3,
            qty: 2
        },
        {
            name: 'Chair',
            SKU: 'Chair',
            price: 50.3,
            qty: 2
        }
    ]
};
