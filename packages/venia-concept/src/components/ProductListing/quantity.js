import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';
import { Form } from 'informed';
import { func, number, string } from 'prop-types';
import { Minus as MinusIcon, Plus as PlusIcon } from 'react-feather';
import { useQuantity } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useQuantity';
import { Text as InformedText } from 'informed';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { Message } from '@magento/venia-ui/lib/components/Field';
import defaultClasses from './quantity.module.css';

export const QuantityFields = props => {
    const {
        initialValue,
        itemId,
        label,
        min,
        onChange,
        message,
        fieldName,
        quickOrder,
        value,
        hideButtons
    } = props;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);
    const iconClasses = { root: classes.icon };

    const talonProps = useQuantity({
        initialValue,
        min,
        onChange,
        fieldName
    });

    const {
        isDecrementDisabled,
        isIncrementDisabled,
        handleBlur,
        handleDecrement,
        handleIncrement,
        maskInput
    } = talonProps;

    const errorMessage = message ? <Message>{message}</Message> : null;

    return (
        <Fragment>
            <div className={classes.root}>
                {label && (
                    <label className={classes.label} htmlFor={itemId}>
                        {label}
                    </label>
                )}
                {!hideButtons && (
                    <button
                        aria-label={formatMessage({
                            id: 'quantity.buttonDecrement',
                            defaultMessage: 'Decrease Quantity'
                        })}
                        className={classes.button_decrement}
                        disabled={isDecrementDisabled}
                        onClick={handleDecrement}
                        type="button"
                        data-cy="Quantity-decrementButton"
                    >
                        <Icon classes={iconClasses} src={MinusIcon} size={22} />
                    </button>
                )}
                <InformedText
                    aria-label={formatMessage({
                        id: 'quantity.input',
                        defaultMessage: 'Item Quantity'
                    })}
                    data-cy="QuantityStepper-input"
                    className={classes.inputQty}
                    field="quantity"
                    id={itemId}
                    inputMode="numeric"
                    mask={maskInput}
                    min={min}
                    value={value}
                    initialValue={value}
                    onBlur={handleBlur}
                    quickOrder={quickOrder}
                    pattern="[0-9]*"
                    onChange={e => onChange(e.target.value)}
                    type="number"
                />
                {!hideButtons && (
                    <button
                        aria-label={formatMessage({
                            id: 'quantity.buttonIncrement',
                            defaultMessage: 'Increase Quantity'
                        })}
                        className={classes.button_increment}
                        disabled={isIncrementDisabled}
                        onClick={handleIncrement}
                        type="button"
                        data-cy="Quantity-incrementButton"
                    >
                        <Icon classes={iconClasses} src={PlusIcon} size={20} />
                    </button>
                )}
            </div>
            {errorMessage}
        </Fragment>
    );
};

const Quantity = props => {
    return (
        <Form
            initialValues={{
                quantity: props.initialValue
            }}
        >
            <QuantityFields {...props} />
        </Form>
    );
};

Quantity.propTypes = {
    initialValue: number,
    itemId: string,
    min: number,
    onChange: func,
    message: string,
    fieldName: string
};

Quantity.defaultProps = {
    min: 0,
    initialValue: 1,
    onChange: () => {},
    fieldName: 'quantity'
};

QuantityFields.defaultProps = {
    min: 0,
    initialValue: 1,
    onChange: () => {}
};

export default Quantity;
