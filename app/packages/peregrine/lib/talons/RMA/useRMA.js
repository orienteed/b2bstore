import { useState, useRef, useCallback } from 'react';
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
    const { data: requestsList } = useQuery(RMA_REQUEST_LIST);
    const { data: customersOrders } = useQuery(GET_CUSTOMER_ORDERS);
    console.log('customersOrders', customersOrders);
    const [createMpRmaRequest, { data, loading, error }] = useMutation(MP_RMA_REQUEST);
    const [cancelMpRmaRequest] = useMutation(MPCANCEL_RMA_REQUEST);
    const formProps = {
        initialValues: formAddress
    };

    const handleSubmit = useCallback(async apiValue => {
        // createMpRmaRequest({ variables: { type: input.value } });
        console.log(apiValue, 'apiValue');
    }, []);
    const handleClose = file => {
        const newFilesUploaded = [...filesUploaded].filter(({ name }) => name != file.name);
        setFilesUploaded(newFilesUploaded);
    };

    const handleReturnChange = e => setReturnType(e.target.value);

    const handleReasonChange = (e, product, type) => {
        console.log(e.target, product, type, '(e, product, type) ');
    };

    const submitRmaRequest = async data => {
        try {
            const { order_increment_id, comment, upload, request_item, reason, solution } = data;
            await createMpRmaRequest({
                variables: {
                    order_increment_id,
                    comment,
                    upload,
                    reason,
                    solution
                }
            });
        } catch {
            throw 'error';
        }
    };

    const submitCancelRmaRequest = async data => {
        try {
            const { request_id } = data;
            await cancelMpRmaRequest({
                variables: {
                    request_id
                }
            });
        } catch {
            throw 'error';
        }
    };
    const handleRedirectCreateRMA = () => push('/rma/form');

    const handleCancel = req => console.log(req);

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
        customersOrders
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
