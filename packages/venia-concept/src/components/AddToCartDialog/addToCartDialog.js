import React, { useMemo } from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useAddToCartDialog } from '../../talons/AddToCartDialog/useAddToCartDialog';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import Dialog from '@magento/venia-ui/lib/components/Dialog';
import Image from '@magento/venia-ui/lib/components/Image';
import Price from '@magento/venia-ui/lib/components/Price';
import Options from '@magento/venia-ui/lib/components/ProductOptions';
import defaultClasses from './addToCartDialog.module.css';
import FormError from '@magento/venia-ui/lib/components/FormError';
import { Spinner } from '@magento/venia-ui/lib/components/LoadingIndicator';

import noImage from './icons/product-package-cancelled.svg';

const AddToCartDialog = props => {
    const { item } = props;

    const talonProps = useAddToCartDialog(props);
    const {
        buttonProps,
        configurableOptionProps,
        formErrors,
        handleOnClose,
        imageProps,
        isFetchingProductDetail,
        priceProps,
        hasVariants,
        isOutOfStock
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

    const cartCallToActionText = !isOutOfStock ? (
        <FormattedMessage
            id="productFullDetail.addItemToCart"
            defaultMessage="Add to Cart"
        />
    ) : (
        <FormattedMessage
            id="productFullDetail.itemOutOfStock"
            defaultMessage="Out of Stock"
        />
    );

    const priceComponent = useMemo(
        () => (priceProps ? <Price {...priceProps} /> : null),
        [priceProps]
    );

    const dialogContent = useMemo(() => {
        if (item) {
            return (
                <div className={classes.root}>
                    {hasVariants ? imageComponent : <img className={classes.noImage} src={noImage} alt="product-not-available" />}
                    <div className={classes.detailsContainer}>
                        <span className={classes.name}>
                            {item.product.name}
                        </span>
                        <span className={classes.price}>{priceComponent}</span>
                        {!hasVariants ?  
                        <div className={classes.errorOptionCombination}>
                            <FormattedMessage
                                id="productFullDetail.errorOptionCombination"
                                defaultMessage="This combination of options doesn´t exist."
                            />
                        </div>  : null}
                        <Options
                            {...configurableOptionProps}
                            classes={{
                                root: undefined,
                                title: classes.optionTitle
                            }}
                        />
                        <Button {...buttonProps}>
                            {cartCallToActionText}
                        </Button>
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
        priceComponent
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
