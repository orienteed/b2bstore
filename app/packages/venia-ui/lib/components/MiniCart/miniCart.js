import React, { Fragment, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Lock as LockIcon, AlertCircle as AlertCircleIcon } from 'react-feather';
import { bool, shape, string } from 'prop-types';

import { useScrollLock, Price, useToasts } from '@magento/peregrine';
import { useMiniCart } from '@magento/peregrine/lib/talons/MiniCart/useMiniCart';
import { useStyle } from '@magento/venia-ui/lib/classify';

import Button from '../Button';
import Icon from '../Icon';
import StockStatusMessage from '../StockStatusMessage';
import ProductList from './ProductList';
import defaultClasses from './miniCart.module.css';

import ConfirmationModal from '../RequestQuote/ConfirmationModal';

const errorIcon = <Icon src={AlertCircleIcon} size={20} />;

/**
 * The MiniCart component shows a limited view of the user's cart.
 *
 * @param {Boolean} props.isOpen - Whether or not the MiniCart should be displayed.
 * @param {Function} props.setIsOpen - Function to toggle mini cart
 */
const MiniCart = React.forwardRef((props, ref) => {
    const { isOpen, setIsOpen } = props;

    // Prevent the page from scrolling in the background
    // when the MiniCart is open.
    useScrollLock(isOpen);

    const talonProps = useMiniCart({
        isOpen,
        setIsOpen
    });

    const {
        closeMiniCart,
        errorMessage,
        handleEditCart,
        handleProceedToCheckout,
        handleRemoveItem,
        loading,
        productList,
        subTotal,
        totalQuantity,
        configurableThumbnailSource,
        storeUrlSuffix,
        SelectedVariants,
        submitQuote,
        isSubmitQuoteDisabled
    } = talonProps;
    const [isQuoteOpen, setIsQuoteOpen] = useState(false);

    const confirmRequestQuote = async () => {
        await submitQuote();
        await setIsQuoteOpen(false);
    };

    const classes = useStyle(defaultClasses, props.classes);
    const rootClass = isOpen ? classes.root_open : classes.root;
    const contentsClass = isOpen ? classes.contents_open : classes.contents;
    const quantityClassName = loading ? classes.quantity_loading : classes.quantity;
    const priceClassName = loading ? classes.price_loading : classes.price;

    const isCartEmpty = !(productList && productList.length);

    const [, { addToast }] = useToasts();
    useEffect(() => {
        if (errorMessage) {
            addToast({
                type: 'error',
                icon: errorIcon,
                message: errorMessage,
                dismissable: true,
                timeout: 7000
            });
        }
    }, [addToast, errorMessage]);

    const requestQuoteClick = () => setIsQuoteOpen(true);

    const requestQuoteButton = (
        <div className={classes.quoteBtn}>
            <Button onClick={requestQuoteClick} priority={'normal'}>
                <FormattedMessage id={'galleryItem.Requestquote'} defaultMessage={'Request quote'} />
            </Button>
        </div>
    );

    const header = subTotal ? (
        <Fragment>
            <div className={classes.stockStatusMessageContainer}>
                <StockStatusMessage cartItems={productList} />
            </div>
            <span data-cy="MiniCart-totalQuantity" className={quantityClassName}>
                <FormattedMessage
                    id={'miniCart.totalQuantity'}
                    defaultMessage={'{totalQuantity} Items'}
                    values={{ totalQuantity }}
                />
            </span>
            <span data-cy="MiniCart-subtotalPrice" className={priceClassName}>
                <span data-cy="MiniCart-subtotalPriceLabel">
                    <FormattedMessage id={'miniCart.subtotal'} defaultMessage={'Subtotal: '} />
                </span>
                <Price currencyCode={subTotal.currency} value={subTotal.value} />
            </span>
        </Fragment>
    ) : null;

    const contents = isCartEmpty ? (
        <div className={classes.emptyCart}>
            <div className={classes.emptyMessage} data-cy="MiniCart-emptyMessage">
                <FormattedMessage id={'miniCart.emptyMessage'} defaultMessage={'There are no items in your cart.'} />
            </div>
        </div>
    ) : (
        <Fragment>
            <div className={classes.header}>{header}</div>
            <div className={classes.body} data-cy="MiniCart-body">
                <ProductList
                    items={productList}
                    loading={loading}
                    handleRemoveItem={handleRemoveItem}
                    closeMiniCart={closeMiniCart}
                    configurableThumbnailSource={configurableThumbnailSource}
                    storeUrlSuffix={storeUrlSuffix}
                />
            </div>
            <div className={classes.footer}>
                <Button
                    onClick={handleProceedToCheckout}
                    priority="high"
                    className={classes.checkoutButton}
                    disabled={loading || isCartEmpty}
                    data-cy="Minicart-checkoutButton"
                >
                    <Icon
                        size={16}
                        src={LockIcon}
                        classes={{
                            icon: classes.checkoutIcon
                        }}
                    />
                    <FormattedMessage id={'miniCart.checkout'} defaultMessage={'CHECKOUT'} />
                </Button>
                {process.env.B2BSTORE_VERSION === 'PREMIUM' && requestQuoteButton}
                <Button
                    onClick={handleEditCart}
                    priority="high"
                    className={classes.editCartButton}
                    disabled={loading || isCartEmpty}
                    data-cy="Minicart-editCartButton"
                >
                    <FormattedMessage id={'miniCart.editCartButton'} defaultMessage={'Edit Shopping Bag'} />
                </Button>
            </div>
            {isQuoteOpen && (
                <ConfirmationModal
                    isOpen={isQuoteOpen}
                    onCancel={() => setIsQuoteOpen(false)}
                    onConfirm={confirmRequestQuote}
                    products={SelectedVariants}
                    isDisabled={isSubmitQuoteDisabled}
                />
            )}
        </Fragment>
    );

    return (
        <aside className={rootClass} data-cy="MiniCart-root">
            <div ref={ref} className={contentsClass}>
                {contents}
            </div>
        </aside>
    );
});

export default MiniCart;

MiniCart.propTypes = {
    classes: shape({
        root: string,
        root_open: string,
        contents: string,
        contents_open: string,
        header: string,
        body: string,
        footer: string,
        checkoutButton: string,
        editCartButton: string,
        emptyCart: string,
        emptyMessage: string,
        stockStatusMessageContainer: string
    }),
    isOpen: bool
};
