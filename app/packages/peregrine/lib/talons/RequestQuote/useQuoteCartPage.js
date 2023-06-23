import { useCallback, useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { AFTER_UPDATE_MY_QUOTE } from './useQuoteCartTrigger';
import { deleteQuoteId } from './Store';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

export const useQuoteCartPage = props => {
    const { getQuoteId } = props;

    const {
        deleteCurrentQuote: deleteCurrentQuoteFromAdapter,
        getConfigDetailsForQuote,
        getQuoteById,
        submitCurrentQuote: submitCurrentQuoteFromAdapter
    } = useAdapter();

    const [myQuote, setMyQuote] = useState({});
    const [submittedQuoteId, setSubmittedQuoteId] = useState(0);
    const [activeEditItem, setActiveEditItem] = useState(false);
    const [isCartUpdating, setIsCartUpdating] = useState(false);

    const history = useHistory();

    // Get config details
    const { loading: configLoading, data: configData } = getConfigDetailsForQuote();
    useMemo(() => {
        if (!configLoading && configData === undefined) {
            history.push('/');
        }
    }, [configData, configLoading, history]);

    // Delete Current Quote Mutation
    const { deleteCurrentQuote } = deleteCurrentQuoteFromAdapter();

    // Submit Current Quote Mutation
    const { submitCurrentQuote } = submitCurrentQuoteFromAdapter();

    // Get Mp Quote
    const { data, loading } = getQuoteById({ quote_id: getQuoteId() });
    useEffect(() => {
        if (data != undefined) {
            const {
                mpQuote: { quote }
            } = data;
            setMyQuote(quote);
        }
    }, [data]);

    useState(() => {
        window.addEventListener(
            AFTER_UPDATE_MY_QUOTE,
            async function (event) {
                await setMyQuote(event.detail);
            },
            false
        );
    });

    const handleDeleteQuote = useCallback(async () => {
        await deleteCurrentQuote();
        await deleteQuoteId();
        await window.dispatchEvent(new CustomEvent(AFTER_UPDATE_MY_QUOTE, { detail: {} }));
    }, [deleteCurrentQuote]);

    const handleSubmitQuoteBtn = useCallback(async () => {
        const {
            data: { mpQuoteSubmit }
        } = await submitCurrentQuote();
        await deleteQuoteId();
        await window.dispatchEvent(new CustomEvent(AFTER_UPDATE_MY_QUOTE, { detail: {} }));
        await history.push('/mprequestforquote/quoteCart/success/' + mpQuoteSubmit);
    }, [submitCurrentQuote, history]);

    return {
        loading,
        myQuote,
        submittedQuoteId,
        setActiveEditItem,
        setIsCartUpdating,
        handleDeleteQuote,
        handleSubmitQuoteBtn
    };
};
