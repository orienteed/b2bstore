import { useMemo, useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { AFTER_UPDATE_MY_QUOTE } from './useQuoteCartTrigger';

import { setQuoteId } from './Store';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_CURRENT_PAGE = 1;
const DEFAULT_TOTAL_PAGE = 0;

/**
 * @function
 *
 * @param {Object} props
 *
 * @returns {useQuotes}
 */
export const useQuotes = () => {
    const {
        addQuoteToCart,
        cancelQuote,
        deleteSubmittedQuote,
        duplicateQuote,
        getConfigDetailsForQuote,
        getQuoteList
    } = useAdapter();

    const history = useHistory();
    const [quotes, setQuotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);
    const [totalPage, setTotalPage] = useState(DEFAULT_TOTAL_PAGE);
    const [isOpen, setIsOpen] = useState(false);

    // Get config details
    const { data: configData, loading: configLoading } = getConfigDetailsForQuote();
    useMemo(() => {
        if (!configLoading && configData == undefined) {
            history.push('/account-information');
        }
    }, [configData, configLoading, history]);

    // Delete Quote Mutation
    const { deleteSubmittedMpQuote } = deleteSubmittedQuote();

    // Cancel Quote Mutation
    const { cancelMpQuote } = cancelQuote();

    // Duplicate Quote Mutation
    const { duplicateMpQuote } = duplicateQuote();

    // Add Quote To Cart Mutation
    const { addMpQuoteToCart } = addQuoteToCart();

    // Get quotes details
    const { data: quoteList, refetch, loading } = getQuoteList({
        pageSize: pageSize,
        currentPage: currentPage || 1
    });

    const handleContentToggle = useCallback(() => {
        setIsOpen(currentValue => !currentValue);
    }, []);

    useEffect(() => {
        setIsLoading(loading);
        if (quoteList != undefined) {
            const {
                mpQuoteList: {
                    page_info: { total_pages },
                    items
                }
            } = quoteList;
            setQuotes(items);
            setTotalPage(total_pages);
            setIsLoading(false);
            items.length === 0 && setCurrentPage(0);
        }
    }, [quoteList, loading]);

    const getMpQuoteList = useCallback(async () => {
        await refetch({
            pageSize: pageSize,
            currentPage: currentPage
        });
    }, [refetch, pageSize, currentPage]);

    // Handle Page Size
    const handlePageSize = useCallback(async event => {
        await setIsLoading(true);
        await setCurrentPage(DEFAULT_CURRENT_PAGE);
        await setPageSize(parseInt(event.target.value));
        await setIsLoading(false);
    }, []);

    // Handle Current Page
    const handleCurrentPage = useCallback(async value => {
        await setIsLoading(true);
        await setCurrentPage(value);
        await setIsLoading(false);
    }, []);

    // Handle Delete Page
    const handleDeleteQuote = useCallback(
        async value => {
            await setIsLoading(true);
            await deleteSubmittedMpQuote({
                variables: {
                    quoteId: parseInt(value)
                }
            });
            await refetch({
                pageSize: pageSize,
                currentPage: currentPage
            });
            await setIsLoading(false);
        },
        [refetch, pageSize, currentPage, deleteSubmittedMpQuote]
    );

    // Handle cancel Page
    const handleCancelQuote = useCallback(
        async value => {
            await setIsLoading(true);
            await cancelMpQuote({
                variables: {
                    quoteId: parseInt(value)
                }
            });
            await refetch({
                pageSize: pageSize,
                currentPage: currentPage
            });
            await setIsLoading(false);
        },
        [refetch, pageSize, currentPage, cancelMpQuote]
    );

    // Handle duplicate Page
    const handleDuplicateQuote = useCallback(
        async value => {
            await setIsLoading(true);
            const {
                data: {
                    duplicateMpQuote: { quote }
                }
            } = await duplicateMpQuote({
                variables: {
                    quoteId: parseInt(value)
                }
            });
            await refetch({
                pageSize: pageSize,
                currentPage: currentPage
            });
            await setQuoteId(quote.entity_id);
            await window.dispatchEvent(new CustomEvent(AFTER_UPDATE_MY_QUOTE, { detail: { ...quote } }));
            await setIsLoading(false);
        },
        [refetch, pageSize, currentPage, duplicateMpQuote]
    );

    // Handle add to cart Page
    const handleQuoteToCart = useCallback(
        async value => {
            await setIsLoading(true);
            await addMpQuoteToCart({
                variables: {
                    quoteId: parseInt(value)
                }
            });
            await refetch({
                pageSize: pageSize,
                currentPage: currentPage
            });
            history.go(0);
        },
        [refetch, pageSize, currentPage, addMpQuoteToCart, history]
    );

    return {
        quotes,
        isLoading,
        totalPage,
        getMpQuoteList,
        isOpen,
        pageSize,
        currentPage,
        handleContentToggle,
        handlePageSize,
        handleCurrentPage,
        handleDeleteQuote,
        handleCancelQuote,
        handleDuplicateQuote,
        handleQuoteToCart
    };
};
