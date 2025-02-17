import { useHistory } from 'react-router-dom';
import { useMemo, useState, useCallback } from 'react';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

const DEFAULT_CURRENT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_TOTAL_PAGE = 0;

export const useSavedCartsPage = () => {
    const { getConfigDetailsForSavedCarts, getSavedCarts: getSavedCartsFromAdapter } = useAdapter();

    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true);
    const [carts, setCarts] = useState([]);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);
    const [totalPage, setTotalPage] = useState(DEFAULT_TOTAL_PAGE);
    const [showCopyUrl, setShowCopyUrl] = useState(false);

    // Get config details
    const { data } = getConfigDetailsForSavedCarts();

    useMemo(() => {
        if (data != undefined) {
            const {
                mpSaveCartConfigs: { enabled, allow_share }
            } = data;
            setShowCopyUrl(allow_share);
            if (!enabled) {
                history.push('/');
            }
        }
    }, [data, history]);

    // Get carts details
    const { data: savedCartData, refetch } = getSavedCartsFromAdapter({
        pageSize: pageSize,
        currentPage: currentPage || 1
    });


    useMemo(() => {
        if (savedCartData != undefined) {
            const {
                mpSaveCartGetCarts: { total_count, items }
            } = savedCartData;

            setCarts(items);
            setTotalPage(Math.ceil(total_count / pageSize));
            setIsLoading(false);
            items.length === 0 && setCurrentPage(0);
        }
    }, [savedCartData, pageSize]);

    // Handle Page Size
    const handlePageSize = useCallback(event => {
        setCurrentPage(DEFAULT_CURRENT_PAGE);
        setPageSize(parseInt(event.target.value));
    }, []);

    // Handle Current Page
    const handleCurrentPage = useCallback(value => {
        setCurrentPage(value);
    }, []);

    const handleIsLoading = useCallback(value => {
        setIsLoading(value);
    }, []);

    const getSavedCarts = useCallback(async () => {
        await refetch({
            pageSize: pageSize,
            currentPage: currentPage
        });
    }, [refetch, pageSize, currentPage]);

    return {
        isLoading,
        carts,
        pageSize,
        currentPage,
        totalPage,
        showCopyUrl,
        handlePageSize,
        handleCurrentPage,
        handleIsLoading,
        getSavedCarts
    };
};
