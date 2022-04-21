import React, { useCallback, useMemo } from 'react';
import { func, number, shape, string } from 'prop-types';
import { Link } from 'react-router-dom';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import Price from '@magento/venia-ui/lib/components/Price';
import { useStyle } from '@magento/venia-ui/lib/classify';

import Icon from '../Icon';
import Image from '@magento/venia-ui/lib/components/Image';
import defaultClasses from './suggestedProduct.module.css';

import Button from '@magento/venia-ui/lib/components/Button';
import { useAddProduct } from '../../talons/AddProduct/useAddProduct';
import {
    ADD_CONFIGURABLE_MUTATION,
    ADD_SIMPLE_MUTATION
} from '@magento/peregrine/lib/talons/ProductFullDetail/productFullDetail.gql.ce';

import { ShoppingBag as ShoppingCartIcon } from 'react-feather';

import { FormattedMessage } from 'react-intl';

const IMAGE_WIDTH = 60;

const SuggestedProduct = props => {
    const suggested_Product = props;
    const classes = useStyle(defaultClasses, props.classes);
    const {
        orParentUrlKey,
        url_key,
        small_image,
        name,
        onNavigate,
        price,
        quickOrder,
        url_suffix
    } = props;

    const handleClick = useCallback(() => {
        if (typeof onNavigate === 'function') {
            onNavigate(props);
        }
    }, [onNavigate]);

    const uri = useMemo(() => resourceUrl(`/${url_key}${url_suffix || ''}`), [
        url_key,
        url_suffix
    ]);

    const talonProps = useAddProduct({
        addConfigurableProductToCartMutation: ADD_CONFIGURABLE_MUTATION,
        addSimpleProductToCartMutation: ADD_SIMPLE_MUTATION,
        suggested_Product
    });

    const { handleAddToCart } = talonProps;

    return (
        <>
            {quickOrder ? (
                <div
                    className={classes.root}
                    onClick={handleClick}
                    data-cy="SuggestedProduct-root"
                >
                    <Image
                        alt={name}
                        classes={{
                            image: classes.thumbnail,
                            root: classes.image
                        }}
                        resource={small_image}
                        width={IMAGE_WIDTH}
                        data-cy="SuggestedProduct-image"
                    />
                    <span className={classes.name}>{name}</span>
                    <span
                        data-cy="SuggestedProduct-price"
                        className={classes.price}
                    >
                        <Price
                            currencyCode={price.regularPrice.amount.currency}
                            value={price.regularPrice.amount.value}
                        />
                    </span>
                </div>
            ) : (
                <Link
                    className={classes.root}
                    to={uri}
                    onClick={handleClick}
                    data-cy="SuggestedProduct-root"
                >
                    <Image
                        alt={name}
                        classes={{
                            image: classes.thumbnail,
                            root: classes.image
                        }}
                        resource={small_image}
                        width={IMAGE_WIDTH}
                        data-cy="SuggestedProduct-image"
                    />
                    <span className={classes.name}>{name}</span>
                    <span
                        data-cy="SuggestedProduct-price"
                        className={classes.price}
                    >
                        <Price
                            currencyCode={price.regularPrice.amount.currency}
                            value={price.regularPrice.amount.value}
                        />
                    </span>
                </Link>
            )}
        </>
    );
};

SuggestedProduct.propTypes = {
    url_key: string.isRequired,
    small_image: string.isRequired,
    name: string.isRequired,
    onNavigate: func,
    price: shape({
        regularPrice: shape({
            amount: shape({
                currency: string,
                value: number
            })
        })
    }).isRequired,
    classes: shape({
        root: string,
        image: string,
        name: string,
        price: string,
        thumbnail: string
    })
};

export default SuggestedProduct;
