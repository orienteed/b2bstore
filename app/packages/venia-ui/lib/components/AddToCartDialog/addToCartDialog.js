import React, { useMemo } from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useAddToCartDialog } from '@magento/peregrine/lib/talons/AddToCartDialog/useAddToCartDialog';

import { useStyle } from '../../classify';
import Button from '../Button';
import Dialog from '../Dialog';
import Image from '../Image';
import Price from '../Price';
import Options from '../ProductOptions';
import defaultClasses from './addToCartDialog.module.css';
import FormError from '../FormError';
import { Spinner } from '../LoadingIndicator';
import QuantityStepper from '../QuantityStepper/quantityStepper';

const AddToCartDialog = props => {
    const { item } = props;

    const talonProps = useAddToCartDialog(props);
    const {
        buttonProps,
        configurableOptionProps,
        formErrors,
        handleOnClose,
        outOfStockVariants,
        imageProps,
        isFetchingProductDetail,
        priceProps,
        selectedVariant,
        handleQuantityChange
    } = talonProps;
    const classes = useStyle(defaultClasses, props.classes);

    const imageComponent = useMemo(
        () =>
            imageProps ? (
                <Image {...imageProps} classes={{ image: classes.image }} />
            ) : (
                <div className={classes.image} />
            ),
        [classes.image, imageProps]
    );

    const priceComponent = useMemo(() => (priceProps ? <Price {...priceProps} /> : null), [priceProps]);

    const dialogContent = useMemo(() => {
        if (item) {
            return (
                <div className={classes.root}>
                    {imageComponent}
                    <div className={classes.detailsContainer}>
                        <span className={classes.name}>{item.product.name}</span>
                        {selectedVariant?.product.stock_status === 'IN_STOCK' && (
                            <span className={classes.price}>{priceComponent}</span>
                        )}
                        <Options
                            {...configurableOptionProps}
                            classes={{
                                root: undefined,
                                title: classes.optionTitle
                            }}
                            outOfStockVariants={outOfStockVariants}
                        />
                        <div className={classes.fornWrapper}>
                            <QuantityStepper
                                fieldName={`${item.sku}`}
                                classes={{
                                    button_increment: classes.disable,
                                    button_decrement: classes.disable,
                                    root: classes.disable_gap
                                }}
                                min={1}
                                isPDP={true}
                                onChange={e => handleQuantityChange(e?.target?.value || e)}
                            />
                            <Button {...buttonProps}>
                                {selectedVariant?.product.stock_status === 'OUT_OF_STOCK' ? (
                                    <FormattedMessage id="productDetail.outOfStock" defaultMessage="Out of stock" />
                                ) : (
                                    <FormattedMessage id="addToCartDialog.addToCart" defaultMessage="Add to Cart" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    }, [
        buttonProps,
        classes.detailsContainer,
        classes.name,
        classes.optionTitle,
        classes.price,
        classes.root,
        configurableOptionProps,
        imageComponent,
        item,
        priceComponent,
        outOfStockVariants,
        selectedVariant
    ]);

    const titleElement = isFetchingProductDetail ? (
        <div className={classes.titleContainer}>
            <Spinner />
        </div>
    ) : null;

    return (
        <Dialog
            classes={{
                headerText: classes.dialogHeaderText
            }}
            isOpen={!!props.item}
            onCancel={handleOnClose}
            shouldShowButtons={false}
            title={titleElement}
        >
            <FormError errors={formErrors} />
            {dialogContent}
        </Dialog>
    );
};

export default AddToCartDialog;

AddToCartDialog.propTypes = {
    classes: shape({
        root: string,
        image: string,
        detailsContainer: string,
        name: string,
        price: string,
        optionTitle: string,
        dialogHeaderText: string,
        titleContainer: string
    }),
    item: shape({
        product: shape({
            name: string.isRequired
        }).isRequired
    })
};
