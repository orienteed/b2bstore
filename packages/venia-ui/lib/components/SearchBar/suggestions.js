import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { useSuggestions } from '@magento/peregrine/lib/talons/SearchBar';

import { useStyle } from '../../classify';
import SuggestedCategories from './suggestedCategories';
import SuggestedProducts from './suggestedProducts';
import defaultClasses from './suggestions.module.css';

const Suggestions = props => {
    const {
        displayResult,
        filters,
        products,
        searchValue,
        setVisible,
        visible,
        handleSearchClick,
        quickOrder
    } = props;
    const { items } = products;

    const talonProps = useSuggestions({
        displayResult,
        filters,
        items,
        setVisible,
        visible
    });
    const { categories, onNavigate, shouldRender } = talonProps;
    const classes = useStyle(defaultClasses, props.classes);

    // render null without data
    if (!shouldRender) {
        return null;
    }

    return (
        <Fragment>
            <SuggestedCategories
                categories={categories}
                onNavigate={e => {
                    handleSearchClick(e);
                    setVisible(false);
                }}
                value={searchValue}
                quickOrder={quickOrder}
            />
            <h2 data-cy="Suggestions-heading" className={classes.heading}>
                <span>
                    <FormattedMessage
                        id={'searchBar.heading'}
                        defaultMessage={'Product Suggestions'}
                    />
                </span>
            </h2>
            <SuggestedProducts
                onNavigate={e => {
                    handleSearchClick(e);
                    setVisible(false);
                }}
                quickOrder={quickOrder}
                products={items}
            />
        </Fragment>
    );
};

export default Suggestions;

Suggestions.propTypes = {
    classes: shape({
        heading: string
    }),
    products: shape({
        filters: arrayOf(
            shape({
                filter_items: arrayOf(shape({})),
                name: string.isRequired
            }).isRequired
        ),
        items: arrayOf(shape({}))
    }),
    searchValue: string,
    setVisible: func,
    visible: bool
};
