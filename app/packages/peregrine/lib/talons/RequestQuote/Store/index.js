import { useEffect, useState } from 'react';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';
const storage = new BrowserPersistence();
const MP_QUOTE_ID = 'mp_QUOTE_id';

export const getConfigData = () => {
    const [isEnable, setIsEnable] = useState(false);
    const [configData, setConfigData] = useState();
    const { getConfigDetailsForQuote } = useAdapter();

    // Get config details
    const { data } = getConfigDetailsForQuote();

    useEffect(() => {
        if (data != undefined) {
            const { mpQuoteConfig } = data;
            setIsEnable(true);
            setConfigData(mpQuoteConfig);
        }
    }, [data]);

    return {
        isEnable,
        configData
    };
};

// Current quote id
export const setQuoteId = quote_id => {
    storage.setItem(MP_QUOTE_ID, quote_id);
};

export const deleteQuoteId = () => {
    storage.removeItem(MP_QUOTE_ID);
};

export const getQuoteId = () => {
    return storage.getItem(MP_QUOTE_ID);
};

export const getMpQuote = () => {
    const [myQuote, setMyQuote] = useState();
    const { getQuoteById } = useAdapter();

    if (getQuoteId() != undefined) {
        const { data } = getQuoteById({ quote_id: getQuoteId(), hasNextFetchPolicy: true });

        useState(() => {
            if (data != undefined) {
                const {
                    mpQuote: { quote }
                } = data;
                setMyQuote(quote);
            }
        }, [data]);
    }

    return {
        ...myQuote
    };
};
