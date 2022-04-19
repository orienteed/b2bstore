import React from 'react';
import { func } from 'prop-types';
import { Search as SearchIcon, X as ClearIcon } from 'react-feather';
import { useSearchField } from '@magento/peregrine/lib/talons/SearchBar';

import Icon from '../Icon';
import TextInput from '../TextInput';
import Trigger from '../Trigger';

import defaultClasses from './searchField.module.css';
const clearIcon = <Icon src={ClearIcon} size={24} />;
const searchIcon = <Icon src={SearchIcon} size={24} />;

const SearchField = props => {
    const {
        isSearchOpen,
        onChange,
        onFocus,
        quickOrder,
        value,
        placeholder
    } = props;
    const { inputRef, resetForm } = useSearchField({ isSearchOpen });

    const resetButton = value ? (
        <Trigger action={resetForm}>{clearIcon}</Trigger>
    ) : null;

    return (
        <div className={defaultClasses.searchField}>
            <TextInput
                after={resetButton}
                before={searchIcon}
                quickOrder={quickOrder}
                field="search_query"
                data-cy="SearchField-textInput"
                onFocus={onFocus}
                onValueChange={onChange}
                forwardedRef={inputRef}
                value={value}
                placeholder={placeholder}
            />
        </div>
    );
};

export default SearchField;

SearchField.propTypes = {
    onChange: func,
    onFocus: func
};
