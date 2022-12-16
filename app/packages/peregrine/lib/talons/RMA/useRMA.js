import { useState, useRef, useCallback } from 'react';

const useRMA = () => {
    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);

    const handleSubmit = useCallback(async ({ name, email, comment, files }) => {
        console.log({ name }, { email }, { comment }, { files });
    }, []);
    return {
        handleSubmit,
        setFormApi
    };
};

export default useRMA;
