/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useMemo, useState, useEffect } from 'react';

/**
 * Talon for Option.
 *
 * @param {number} props.attribute_id the id of the option
 * @param {function} props.onSelectionChange callback handler for when the option is clicked
 * @param {string} props.selectedValue the label of the selected option
 * @param {array} props.values an array containing possible values
 */
export const useOption = props => {
    const { attribute_id, onSelectionChange, selectedValue, values, isFirstOption, selected } = props;
    const [selection, setSelection] = useState(selected);
    useEffect(() => {
        setSelection(selected);
    }, [selected]);

    const initialSelection = useMemo(() => {
        let initialSelection = {};
        const searchValue = selected || selection || selectedValue;
        if (searchValue) {
            initialSelection = values.find(value => value.default_label === searchValue) || {};
        }
        return initialSelection;
    }, [selectedValue, selection, values]);

    const valuesMap = useMemo(() => {
        return new Map(values.map(value => [value.value_index, value.store_label]));
    }, [values]);

    useEffect(() => {
        if (isFirstOption) {
            const [firstKey] = valuesMap.keys();
            setSelection(valuesMap.get(firstKey));
        }
    }, []);
    const selectedValueDescription = selection || initialSelection.default_label || 'None';

    const handleSelectionChange = useCallback(
        selected => {
            if (isFirstOption) {
                setSelection(valuesMap.get(selected));
            } else {
                setSelection(valuesMap.get(selected) === selection ? undefined : valuesMap.get(selected));
            }

            if (onSelectionChange) {
                onSelectionChange(attribute_id, selected);
            }
        },
        [attribute_id, onSelectionChange, valuesMap, selection, isFirstOption]
    );
    return {
        handleSelectionChange,
        initialSelection,
        selectedValueDescription
    };
};
