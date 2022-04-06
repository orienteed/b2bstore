import React from 'react';
import { shape, string } from 'prop-types';
import { Search as SearchIcon } from 'react-feather';
import { useIntl } from 'react-intl';

import Icon from '../../../node_modules/@magento/venia-ui/lib/components/Icon';
import { mergeClasses } from '../../../node_modules/@magento/venia-ui/lib/classify';
import defaultClasses from './searchTrigger.module.css';
import { useSearchTrigger } from '@magento/peregrine/lib/talons/Header/useSearchTrigger';
import customSearchIcon from './icons/ICONO_BUSCAR.svg';

const SearchTrigger = React.forwardRef((props, ref) => {
    const { active, onClick } = props;

    const talonProps = useSearchTrigger({
        onClick
    });
    const { handleClick } = talonProps;
    const { formatMessage } = useIntl();

    const classes = mergeClasses(defaultClasses, props.classes);

    const searchClass = active ? classes.open : classes.root;

    const searchText = formatMessage({
        id: 'searchTrigger.search',
        defaultMessage: 'Search'
    });

    return (
        <button
            className={searchClass}
            aria-label={searchText}
            onClick={handleClick}
            ref={ref}
        >
       
            <Icon src={SearchIcon} /> 
            <span className={classes.label}>{searchText}</span>
        </button>
    );
});

SearchTrigger.propTypes = {
    classes: shape({
        root: string,
        open: string
    })
};

export default SearchTrigger;
