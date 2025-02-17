import { useEffect, useMemo } from 'react';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';
import debounce from 'lodash.debounce';

/**
 * @typedef { import("graphql").DocumentNode } DocumentNode
 */

/**
 * Returns props necessary to render an Autocomplete component.
 * @param {Object} props
 * @param {Boolean} props.valid - whether to run the query
 * @param {Boolean} props.visible - whether to show the element
 */
export const useAutocomplete = props => {
    const { valid, visible, inputText: value } = props;

    const { getAutocompleteResults } = useAdapter();

    // Prepare to run the queries.
    const { runSearch, productResult } = getAutocompleteResults({ inputText: value, hasVars: true });

    // Create a debounced function so we only search some delay after the last
    // keypress.
    const debouncedRunQuery = useMemo(
        () =>
            debounce(inputText => {
                runSearch({ variables: { inputText } });
            }, 500),
        [runSearch]
    );

    // run the query once on mount, and again whenever state changes
    useEffect(() => {
        if (valid && visible) {
            debouncedRunQuery(value);
        }
    }, [debouncedRunQuery, valid, value, visible]);

    const { data, error, loading } = productResult;

    // Handle results.
    const products = data && data.products;
    const filters = data && data.products?.aggregations;
    const hasResult = products && products.items;
    const resultCount = products && products.total_count;
    const displayResult = valid && hasResult;
    const invalidCharacterLength = !valid && value ? true : false;
    let messageType = '';

    if (invalidCharacterLength) {
        messageType = 'INVALID_CHARACTER_LENGTH';
    } else if (error) {
        messageType = 'ERROR';
    } else if (loading) {
        messageType = 'LOADING';
    } else if (!displayResult) {
        messageType = 'PROMPT';
    } else if (!resultCount) {
        messageType = 'EMPTY_RESULT';
    } else {
        messageType = 'RESULT_SUMMARY';
    }

    return {
        displayResult,
        filters,
        messageType,
        products,
        resultCount,
        value
    };
};
