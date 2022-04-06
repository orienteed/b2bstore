import React, { useMemo, useCallback } from 'react';
import { ChevronDown as ArrowDown } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';
import { array, arrayOf, shape, string, oneOf } from 'prop-types';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';

import { useStyle } from '@magento/venia-ui/lib/classify';
import SortItem from '@magento/venia-ui/lib/components/ProductSort/sortItem';
import defaultClasses from './productSort.module.css';
import Button from '@magento/venia-ui/lib/components/Button';
import Icon from '@magento/venia-ui/lib/components/Icon';

const ProductSort = props => {
    const classes = useStyle(defaultClasses, props.classes);
    let { availableSortMethods, sortProps } = props;
    const [currentSort, setSort] = sortProps;
    const { elementRef, expanded, setExpanded } = useDropdown();
    const { formatMessage } = useIntl();
    availableSortMethods = [
        {
            id: 'sortItem.position',
            text: formatMessage({
                id: 'sortItem.positionBar',
                defaultMessage: 'position'
            }),
            attribute: 'position',
            sortDirection: 'ASC'
        },
        {
            id: 'sortItem.relevance',
            text: formatMessage({
                id: 'sortItem.relevanceBar',
                defaultMessage: 'relevance'
            }),
            attribute: 'relevance',
            sortDirection: 'DESC'
        },
        {
            id: 'sortItem.priceAsc',
            text: formatMessage({
                id: 'sortItem.priceAscBar',
                defaultMessage: 'price: Low to High'
            }),
            attribute: 'price',
            sortDirection: 'ASC'
        },
        {
            id: 'sortItem.priceDesc',
            text: formatMessage({
                id: 'sortItem.priceDescBar',
                defaultMessage: 'price: High to Low'
            }),
            attribute: 'price',
            sortDirection: 'DESC'
        }
    ];

    // click event for menu items
    const handleItemClick = useCallback(
        sortAttribute => {
            setSort({
                sortText: sortAttribute.text,
                sortId: sortAttribute.id,
                sortAttribute: sortAttribute.attribute,
                sortDirection: sortAttribute.sortDirection
            });
            setExpanded(false);
        },
        [setExpanded, setSort]
    );

    const sortElements = useMemo(() => {
        // should be not render item in collapsed mode.
        if (!expanded) {
            return null;
        }

        const itemElements = Array.from(availableSortMethods, sortItem => {
            const { attribute, sortDirection } = sortItem;
            const isActive =
                currentSort.sortAttribute === attribute &&
                currentSort.sortDirection === sortDirection;

            const key = `${attribute}--${sortDirection}`;
            return (
                <li key={key} className={classes.menuItem}>
                    <SortItem
                        sortItem={sortItem}
                        active={isActive}
                        onClick={handleItemClick}
                    />
                </li>
            );
        });

        return (
            <div className={classes.menu}>
                <ul>{itemElements}</ul>
            </div>
        );
    }, [
        availableSortMethods,
        classes.menu,
        classes.menuItem,
        currentSort.sortAttribute,
        currentSort.sortDirection,
        expanded,
        handleItemClick
    ]);

    // expand or collapse on click
    const handleSortClick = () => {
        setExpanded(!expanded);
    };

    return (
        <div
            ref={elementRef}
            className={classes.root}
            aria-live="polite"
            aria-busy="false"
        >
            <Button
                priority={'low'}
                classes={{
                    root_lowPriority: classes.sortButton
                }}
                onClick={handleSortClick}
            >
                <span className={classes.mobileText}>
                    <FormattedMessage
                        id={'productSort.sortButton'}
                        defaultMessage={'Sort'}
                    />
                </span>
                <span className={classes.desktopText}>
                    <span className={classes.sortText}>
                        <FormattedMessage
                            id={'productSort.sortByButton'}
                            defaultMessage={'Sort by'}
                        />
                        {currentSort.sortText === 'Position'
                            ? formatMessage({
                                  id: 'sortItem.positionBar',
                                  defaultMessage: 'position'
                              })
                            : currentSort.sortText}
                    </span>
                    <Icon
                        src={ArrowDown}
                        classes={{
                            root: classes.desktopIconWrapper,
                            icon: classes.desktopIcon
                        }}
                    />
                </span>
            </Button>
            {sortElements}
        </div>
    );
};

const sortDirections = oneOf(['ASC', 'DESC']);

ProductSort.propTypes = {
    classes: shape({
        menuItem: string,
        menu: string,
        root: string,
        sortButton: string
    }),
    availableSortMethods: arrayOf(
        shape({
            text: string,
            id: string,
            attribute: string,
            sortDirection: sortDirections
        })
    ),
    sortProps: array
};

export default ProductSort;
