import React, { Fragment, useState, useCallback, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ChevronDown, ChevronUp, Printer } from 'react-feather';
import { useWishlist } from '@magento/peregrine/lib/talons/WishlistPage/useWishlist';
import { bool, shape, string, int } from 'prop-types';

import { useStyle } from '../../classify';
import LoadingIndicator from '../LoadingIndicator';
import Icon from '../Icon';
import WishlistItems from './wishlistItems';
import Button from '../Button';
import defaultClasses from './wishlist.module.css';
import ActionMenu from './actionMenu';

import { useToasts } from '@magento/peregrine';
import { useReactToPrint } from 'react-to-print';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

import { ShareWithBorderIcon } from '@magento/venia-ui/lib/assets/shareWithBorderIcon';
import { ThrashIcon } from '@magento/venia-ui/lib/assets/ThrashIcon';
import { CSVLink } from 'react-csv';
/**
 * A single wishlist container.
 *
 * @param {Object} props.data the data for this wishlist
 * @param {boolean} props.shouldRenderVisibilityToggle whether or not to render the visiblity toggle
 * @param {boolean} props.isCollapsed whether or not is the wishlist unfolded
 */
const Wishlist = props => {
    const { data, shouldRenderVisibilityToggle, isCollapsed } = props;
    const { formatMessage } = useIntl();
    const { id, items_count: itemsCount, name, visibility } = data;

    const { removeProductsFromWishlist: removeProductsFromWishlistFromAdapter } = useAdapter();

    const [isRemovalInProgress, setIsRemovalInProgress] = useState(false);
    const [, { addToast }] = useToasts();

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current
    });

    const [removeProductFromWishlistError, setRemoveProductFromWishlistError] = useState(null);

    const wishlistId = id;
    const talonProps = useWishlist({ id, itemsCount, isCollapsed });
    const { handleContentToggle, isOpen, items, isLoading, isFetchingMore, handleLoadMore, csvItems } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);
    const contentClass = isOpen ? classes.content : classes.content_hidden;
    const contentToggleIconSrc = isOpen ? ChevronUp : ChevronDown;
    const contentToggleIcon = <Icon src={contentToggleIconSrc} size={24} />;

    const idsOfItems = items.map(item => item.id);

    const { removeProductsFromWishlist } = removeProductsFromWishlistFromAdapter({
        wishlistId: wishlistId,
        wishlistItemsId: idsOfItems
    });

    const handleRemoveAllProductsFromWishlist = useCallback(async () => {
        try {
            setIsRemovalInProgress(true);
            await removeProductsFromWishlist();
        } catch (e) {
            setIsRemovalInProgress(false);
            console.error(e);
            setRemoveProductFromWishlistError(e);
            if (process.env.NODE_ENV !== 'production') {
                console.error(e);
            }
        }
    }, [removeProductsFromWishlist, setRemoveProductFromWishlistError]);

    const handleShareClick = () => {
        navigator.clipboard.writeText(window.location.href);
        addToast({
            type: 'success',
            message: formatMessage({
                id: 'wishlist.copiedUrl',
                defaultMessage: 'The page URL was copied to the clipboard'
            })
        });
    };

    const itemsCountMessage =
        itemsCount && isOpen
            ? formatMessage(
                {
                    id: 'wishlist.itemCountOpen',
                    defaultMessage: 'Favorites ({currentCount} products)'
                },
                { currentCount: items.length, count: itemsCount }
            )
            : formatMessage(
                {
                    id: 'wishlist.itemCountClosed',
                    defaultMessage: `You have {count} {count, plural,
                        one {item}
                        other {items}
                      } in this list`
                },
                { count: itemsCount }
            );
    const loadMoreButton =
        items && items.length < itemsCount ? (
            <div>
                <Button className={classes.loadMore} disabled={isFetchingMore} onClick={handleLoadMore}>
                    <FormattedMessage id={'wishlist.loadMore'} defaultMessage={'Load more'} />
                </Button>
            </div>
        ) : null;

    const contentMessageElement = itemsCount ? (
        <Fragment>
            <WishlistItems items={items} wishlistId={id} ref={componentRef} />
            {loadMoreButton}
        </Fragment>
    ) : (
        <p className={classes.emptyListText}>
            <FormattedMessage
                id={'wishlist.emptyListText'}
                defaultMessage={'There are currently no items in this list'}
            />
        </p>
    );

    // const wishlistName = name ? (
    //     <div className={classes.nameContainer}>
    //         <h2 className={classes.name} data-cy="Wishlist-name" title={name}>
    //             {name}
    //         </h2>
    //     </div>
    // ) : (
    //     <div className={classes.nameContainer}>
    //         <h2 className={classes.name}>
    //             <FormattedMessage
    //                 id={'wishlist.name'}
    //                 defaultMessage={'Wish List'}
    //             />
    //         </h2>
    //     </div>
    // );

    if (isLoading) {
        return (
            <div className={classes.root}>
                <div className={classes.header}>
                    {/* {wishlistName}*/} {itemsCountMessage}
                    <div className={classes.buttonsContainer}>
                        <ActionMenu id={id} name={name} visibility={visibility} />
                    </div>
                </div>
                <LoadingIndicator />
            </div>
        );
    }

    const visibilityToggleClass = shouldRenderVisibilityToggle
        ? classes.visibilityToggle
        : classes.visibilityToggle_hidden;

    const buttonsContainer = id ? (
        <div className={classes.buttonsContainer} data-cy="wishlist-buttonsContainer">
            <ActionMenu id={id} name={name} visibility={visibility} />
            <button className={visibilityToggleClass} onClick={handleContentToggle} type="button">
                {contentToggleIcon}
            </button>
        </div>
    ) : null;

    const printAddAllToCartShareSection = (
        <section className={classes.printAddAllToCartShareContainer}>
            <button onClick={handlePrint} className={classes.printAllContainer}>
                <Icon size={16} src={Printer} />
                <span>
                    <FormattedMessage id={'wishlist.printPage'} defaultMessage={'Print page'} />
                </span>
            </button>
            <CSVLink filename="Downloaded-favourateItems.csv" data={csvItems}>
                <Button priority='high'>
                    <FormattedMessage id={'download'} defaultMessage={'download'} />
                </Button>
            </CSVLink>
        </section>
    );

    return (
        <div className={classes.root} data-cy="Wishlist-root">
            <div className={classes.header}>
                <div className={classes.itemsCountContainer}>{itemsCountMessage}</div>
                <button
                    className={classes.deleteItem}
                    data-cy="wishlistItem-deleteItem"
                    onClick={handleRemoveAllProductsFromWishlist}
                >
                    <ThrashIcon />

                    <span>
                        <FormattedMessage id={'wishlist.removeAll'} defaultMessage={'Remove all'} />
                    </span>
                </button>
                {/* {buttonsContainer} */}
            </div>
            {printAddAllToCartShareSection}
            <div className={contentClass}>{contentMessageElement}</div>
        </div>
    );
};

Wishlist.propTypes = {
    classes: shape({
        root: string,
        header: string,
        content: string,
        content_hidden: string,
        emptyListText: string,
        name: string,
        nameContainer: string,
        visibilityToggle: string,
        visibilityToggle_hidden: string,
        visibility: string,
        buttonsContainer: string,
        loadMore: string
    }),
    shouldRenderVisibilityToggle: bool,
    isCollapsed: bool,
    data: shape({
        id: int,
        items_count: int,
        name: string,
        visibility: string
    })
};

Wishlist.defaultProps = {
    data: {
        items_count: 0,
        items_v2: []
    }
};

export default Wishlist;
