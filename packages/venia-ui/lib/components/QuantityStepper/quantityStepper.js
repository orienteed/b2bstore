import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';
import { Minus as MinusIcon, Plus as PlusIcon } from 'react-feather';
import { useQuantityStepper } from '@magento/peregrine/lib/talons/QuantityStepper/useQuantityStepper';
import { Text as InformedText } from 'informed';

import { useStyle } from '../../classify';
import Icon from '../Icon';
import TextInput from '../TextInput';
import { Message } from '../Field';
import defaultClasses from './quantityStepper.module.css';

const QuantityStepper = props => {
    const {
        initialValue,
        itemId,
        quickOrder,
        label,
        min,
        onChange,
        hideButtons,
        message,
        value
    } = props;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);
    const iconClasses = { root: classes.icon };

    const talonProps = useQuantityStepper({
        initialValue,
        min,
        onChange
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
            <div
                className={`${classes.root} ${quickOrder &&
                    defaultClasses.quickOrder}`}
            >
                <label className={classes.label} htmlFor={itemId}>
                    {label}
                </label>
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
            </div>
            {errorMessage}
        </Fragment>
    );
};

QuantityStepper.defaultProps = {
    min: 0,
    initialValue: 1,
    onChange: () => {}
};

export default QuantityStepper;