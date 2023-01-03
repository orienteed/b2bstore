import { useState, useRef, useCallback } from 'react';

const useRMA = () => {
    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);
    const [dropzoneError, setDropzoneError] = useState('');
    const [comment, setComment] = useState('');
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [filesUploaded, setFilesUploaded] = useState([]);
    const [formAddress, setFormAddress] = useState();
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
        setFormApi
    };
};

export default useRMA;
