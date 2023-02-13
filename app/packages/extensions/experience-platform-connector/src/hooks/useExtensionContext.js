import { useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';

import { GET_EXTENSION_CONTEXT } from '../queries/getExtensionContext.js';

const useExtensionContext = () => {
	const [fetchExtensionContext, { called, data, loading, error }] = useLazyQuery(GET_EXTENSION_CONTEXT);
	useEffect(() => {
		fetchExtensionContext();
	}, [fetchExtensionContext]);

	return {
		ready: called && !loading,
		data,
		error
	};
};

export default useExtensionContext;
