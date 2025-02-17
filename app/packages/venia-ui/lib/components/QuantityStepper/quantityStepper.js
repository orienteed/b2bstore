import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';
import { Minus as MinusIcon, Plus as PlusIcon } from 'react-feather';
import { useQuantityStepper } from '@magento/peregrine/lib/talons/QuantityStepper/useQuantityStepper';

import { useStyle } from '../../classify';
import Icon from '../Icon';
import TextInput from '../TextInput';
import { Message } from '../Field';
import defaultClasses from './quantityStepper.module.css';

const QuantityStepper = props => {
    const { initialValue, itemId, label, min, max, onChange, message, fieldName = 'quantity', textProps, isPDP } = props;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);
    const iconClasses = { root: classes.icon };

    const talonProps = useQuantityStepper({
        initialValue,
        min,
        max,
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

    const handlePreventKeyDown = (e) => {
        if(e.keyCode === 13) {
            e.preventDefault()
        }
    }

    return (
        <Fragment>
            <div className={classes.root}>
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
                <TextInput
                    aria-label={formatMessage({
                        id: 'quantity.input',
                        defaultMessage: 'Item Quantity'
                    })}
                    data-cy="QuantityStepper-input"
                    classes={{ input: classes.input }}
                    field={fieldName}
                    id={itemId}
                    inputMode="numeric"
                    mask={maskInput}
                    min={min}
                    max={max}
                    onBlur={handleBlur}
                    pattern="[0-9]*"
                    onKeyDown={handlePreventKeyDown}
                    onChange={isPDP && onChange}
                    {...textProps}
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
    max: 1000,
    initialValue: 1,
    fieldName: 'quantity',
    onChange: () => {}
};

export default QuantityStepper;
