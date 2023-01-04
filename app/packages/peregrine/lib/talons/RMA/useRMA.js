import { useState, useRef, useCallback } from 'react';

const useRMA = () => {
    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);
    const [dropzoneError, setDropzoneError] = useState('');
    const [comment, setComment] = useState('');
    const [returnType, setReturnType] = useState('allItems');
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [filesUploaded, setFilesUploaded] = useState([]);
    const [formAddress] = useState();

    const formProps = {
        initialValues: formAddress
    };
    const handleSubmit = useCallback(async apiValue => {
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
        returnType
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
