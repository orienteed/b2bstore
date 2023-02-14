import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';
import { getSearchParam } from '@magento/peregrine/lib/hooks/useSearchParam';
import { useFormApi } from 'informed';
import { useCallback, useEffect, useRef } from 'react';

/**
 * Returns props necessary to render a SearchField component.
 */
export const useSearchField = props => {
	const { isSearchOpen } = props;

	const inputRef = useRef();
	const { value } = useFieldState('search_query');
	const formApi = useFormApi();

	const resetForm = useCallback(() => {
		formApi.reset();
	}, [formApi]);

	// When the search field is opened focus on the input.
	useEffect(() => {
		if (isSearchOpen && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isSearchOpen]);

	// Pre-populate the search field with the search term from the URL.
	// We purposefully only ever run this effect on initial mount.
	useEffect(() => {
		const urlTerm = getSearchParam('query', location);

		if (!formApi || !urlTerm) {
			return;
		}

		formApi.setValue('search_query', urlTerm);
	}, []);

	return {
		inputRef,
		resetForm,
		value
	};
};
