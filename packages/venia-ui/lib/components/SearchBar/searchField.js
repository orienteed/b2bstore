import React from 'react';
import { func } from 'prop-types';
import { Search as SearchIcon, X as ClearIcon } from 'react-feather';
import { useSearchField } from '@magento/peregrine/lib/talons/SearchBar';

import Icon from '../Icon';
import TextInput from '../TextInput';
import Trigger from '../Trigger';
import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';

import defaultClasses from './searchField.module.css';
import { useStyle } from '../../classify';
const clearIcon = <Icon src={ClearIcon} size={24} />;
const searchIcon = <Icon src={SearchIcon} size={24} />;

const SearchField = props => {
    const {
        isSearchOpen,
        onChange,
        onFocus,
        quickOrder,
        value,
        placeholder,
        ...rest
    } = props;
    const classes = useStyle(defaultClasses);
    const { inputRef, resetForm } = useSearchField({ isSearchOpen });
    const fieldState = useFieldState('search_query');
    const inputClass = fieldState.error ? classes.input_error : classes.input;

    const resetButton = value ? (
        <Trigger action={resetForm}>{clearIcon}</Trigger>
    ) : null;

    return (
        <div className={defaultClasses.searchField}>
            <input
                onChange={e => onChange(e.target.value)}
                value={value}
                {...rest}
                className={`${inputClass} ${quickOrder &&
                    defaultClasses.inputQty}`}
            />
        </div>
    );
};

export default SearchField;

SearchField.propTypes = {
    onChange: func,
    onFocus: func
};
