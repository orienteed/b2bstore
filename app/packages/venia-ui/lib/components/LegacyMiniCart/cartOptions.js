import React, { Suspense } from 'react';
import { array, bool, func, number, shape, string } from 'prop-types';
import { Form } from 'informed';

import Button from '../Button';
import LoadingIndicator from '../LoadingIndicator';
import Price from '@magento/venia-ui/lib/components/Price';
import Quantity from '../ProductQuantity';

import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';
import { useCartOptions } from '@magento/peregrine/lib/talons/LegacyMiniCart/useCartOptions';
import { useStyle } from '../../classify';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

import defaultClasses from './cartOptions.module.css';

import { ADD_CONFIGURABLE_PRODUCT_TO_CART, ADD_SIMPLE_PRODUCT_TO_CART } from '../ProductFullDetail/productFullDetail.gql';

const Options = React.lazy(() => import('../ProductOptions'));

const LOADING_TEXT = 'Fetching Options...';

const loadingIndicator = (
    <LoadingIndicator>
        <span>{LOADING_TEXT}</span>
    </LoadingIndicator>
);

const CANCEL_BUTTON_TEXT = 'Cancel';
const UPDATE_BUTTON_TEXT = 'Update Cart';
const QUANTITY_TITLE = 'Quantity';

const CartOptions = props => {
    const { cartItem, configItem, currencyCode, endEditItem } = props;

    const { 
        addConfigurableProductToCart: addConfigurableProductToCartFromAdapter,
        addSimpleProductToCart: addSimpleProductToCartFromAdapter
    } = useAdapter();

    const talonProps = useCartOptions({
        addConfigurableProductToCartFromAdapter,
        addSimpleProductToCartFromAdapter,
        cartItem,
        configItemu,
        endEditItem
    });

    const {
        itemName,
        itemPrice,
        initialQuantity,
        handleCancel,
        handleSelectionChange,
        handleUpdate,
        handleValueChange,
        isUpdateDisabled
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    const options = isProductConfigurable(configItem) ? (
        <Suspense fallback={loadingIndicator}>
            <section className={classes.options}>
                <Options
                    onSelectionChange={handleSelectionChange}
                    options={configItem.configurable_options}
                    selectedValues={cartItem.configurable_options}
                />
            </section>
        </Suspense>
    ) : null;

    return (
        <Form className={classes.root}>
            <div className={classes.focusItem}>
                <span className={classes.name}>{itemName}</span>
                <span className={classes.price}>
                    <Price currencyCode={currencyCode} value={itemPrice} />
                </span>
            </div>
            <div className={classes.form}>
                {options}
                <section className={classes.quantity}>
                    <h2 className={classes.quantityTitle}>
                        <span>{QUANTITY_TITLE}</span>
                    </h2>
                    <Quantity initialValue={initialQuantity} onValueChange={handleValueChange} />
                </section>
            </div>
            <div className={classes.save}>
                <Button priority="high" onClick={handleUpdate} disabled={isUpdateDisabled}>
                    <span>{UPDATE_BUTTON_TEXT}</span>
                </Button>
                <Button onClick={handleCancel} priority="low">
                    <span>{CANCEL_BUTTON_TEXT}</span>
                </Button>
            </div>
        </Form>
    );
};

CartOptions.propTypes = {
    cartItem: shape({
        id: string.isRequired,
        product: shape({
            name: string.isRequired,
            price: shape({
                regularPrice: shape({
                    amount: shape({
                        value: number.isRequired
                    })
                })
            })
        })
    }),
    classes: shape({
        root: string,
        focusItem: string,
        price: string,
        form: string,
        quantity: string,
        quantityTitle: string,
        save: string,
        options: string
    }),
    configItem: shape({
        __typename: string,
        configurable_options: array
    }).isRequired,
    currencyCode: string,
    endEditItem: func.isRequired,
    isUpdatingItem: bool
};

export default CartOptions;
