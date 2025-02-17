import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Heart } from 'react-feather';
import { Link } from 'react-router-dom';
import { useProduct } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useProduct';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import Price from '@magento/venia-ui/lib/components/Price';

import { useStyle } from '../../../classify';
import Icon from '../../Icon';
import Image from '../../Image';
import Kebab from '../../LegacyMiniCart/kebab';
import ProductOptions from '../../LegacyMiniCart/productOptions';
import Section from '../../LegacyMiniCart/section';
import AddToListButton from '../../Wishlist/AddToListButton';
import Quantity from './quantity';

import defaultClasses from './product.module.css';

const IMAGE_SIZE = 100;

const HeartIcon = <Icon size={16} src={Heart} />;

const Product = props => {
    const { item } = props;

    const { formatMessage } = useIntl();
    const talonProps = useProduct({
        ...props
    });

    const {
        addToWishlistProps,
        errorMessage,
        handleEditItem,
        handleRemoveFromCart,
        handleUpdateItemQuantity,
        isEditable,
        product,
        isProductUpdating
    } = talonProps;

    const errorMsg = (errorMessage == 'Variable "$quantity" of non-null type "Float!" must not be null.') ? 'Insert a value for the quantity of the product.' : errorMessage;
    const { currency, image, name, options, quantity, stockStatus, unitPrice, urlKey, urlSuffix } = product;

    const classes = useStyle(defaultClasses, props.classes);

    const itemClassName = isProductUpdating ? classes.item_disabled : classes.item;

    const editItemSection = isEditable ? (
        <Section
            text={formatMessage({
                id: 'product.editItem',
                defaultMessage: 'Edit item'
            })}
            data-cy="Product-Section-editItem"
            onClick={handleEditItem}
            icon="Edit2"
            classes={{
                text: classes.sectionText
            }}
        />
    ) : null;

    const itemLink = useMemo(() => resourceUrl(`/${urlKey}${urlSuffix || ''}`), [urlKey, urlSuffix]);

    const stockStatusMessage =
        stockStatus === 'OUT_OF_STOCK'
            ? formatMessage({
                  id: 'product.outOfStock',
                  defaultMessage: 'Out-of-stock'
              })
            : '';

    return (
        <li className={classes.root} data-cy="Product-root">
            <span className={classes.errorText}>{errorMsg}</span>
            <div className={itemClassName}>
                <Link to={itemLink} className={classes.imageContainer} data-cy="Product-imageContainer">
                    <Image
                        alt={name}
                        classes={{
                            root: classes.imageRoot,
                            image: classes.image
                        }}
                        width={IMAGE_SIZE}
                        resource={image}
                        data-cy="Product-image"
                    />
                </Link>
                <div className={classes.details}>
                    <div className={classes.name} data-cy="Product-name">
                        <Link to={itemLink}>{name}</Link>
                    </div>
                    <ProductOptions
                        options={options}
                        classes={{
                            options: classes.options,
                            optionLabel: classes.optionLabel
                        }}
                    />
                    <span className={classes.price} data-cy="Product-price">
                        <Price currencyCode={currency} value={unitPrice} />
                        <FormattedMessage id={'product.price'} defaultMessage={' ea.'} />
                    </span>
                    <span className={classes.stockStatusMessage}>{stockStatusMessage}</span>
                    <div className={classes.quantity}>
                        <Quantity itemId={item.id} initialValue={quantity} onChange={handleUpdateItemQuantity} />
                    </div>
                </div>
                <Kebab
                    classes={{
                        root: classes.kebab
                    }}
                    disabled={true}
                >
                    {editItemSection}
                    <Section
                        text={formatMessage({
                            id: 'product.removeFromCart',
                            defaultMessage: 'Remove from cart'
                        })}
                        data-cy="Product-Section-removeFromCart"
                        onClick={handleRemoveFromCart}
                        icon="Trash"
                        classes={{
                            text: classes.sectionText
                        }}
                    />
                    <li>
                        <AddToListButton
                            {...addToWishlistProps}
                            classes={{
                                root: classes.addToListButton,
                                root_selected: classes.addToListButton_selected
                            }}
                            icon={HeartIcon}
                        />
                    </li>
                </Kebab>
            </div>
        </li>
    );
};

export default Product;
