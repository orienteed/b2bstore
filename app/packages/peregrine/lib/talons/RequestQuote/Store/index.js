/* eslint-disable react-hooks/rules-of-hooks */
import { useQuery } from '@apollo/client';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
import { useEffect, useState } from 'react';

import { GET_CONFIG_DETAILS, MP_QUOTE } from '../requestQuote.gql';
const storage = new BrowserPersistence();
const MP_REQUEST_QUOTE_ID = 'mp_request_quote_id';

export const getConfigData = () => {
	const [isEnable, setIsEnable] = useState(false);
	const [configData, setConfigData] = useState();

	// Get config details
	const { data } = useQuery(GET_CONFIG_DETAILS, {
		fetchPolicy: 'network-only'
	});

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
	storage.setItem(MP_REQUEST_QUOTE_ID, quote_id);
};

export const deleteQuoteId = () => {
	storage.removeItem(MP_REQUEST_QUOTE_ID);
};

export const getQuoteId = () => {
	return storage.getItem(MP_REQUEST_QUOTE_ID);
};

export const getMpQuote = () => {
	const [myQuote, setMyQuote] = useState();

	if (getQuoteId() != undefined) {
		const { data } = useQuery(MP_QUOTE, {
			fetchPolicy: 'cache-and-network',
			nextFetchPolicy: 'cache-first',
			variables: {
				quote_id: getQuoteId()
			}
		});

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
