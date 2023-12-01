import React, { Fragment, useRef } from 'react';
import { useIntl } from 'react-intl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { Message } from '@magento/venia-ui/lib/components/Field';
import defaultClasses from './quantityStepperSimple.module.css';
import PropTypes from 'prop-types';
//Quantity stepper simplified (without buttons for increment and decrement) and with a timeout that correct the value inserted if wrong

export const QuantityStepperSimple = props => {
    const {
        decimalsAllowed,
        disabled,
        fieldName,
        inputKey,
        itemId,
        message,
        min,
        max,
        onBlur,
        onChange,
        value
    } = props;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);
    const handleFocus = (event) => event.target.select();
    const errorMessage = message ? <Message>{message}</Message> : null;
    const handleKeyDown = e => {
        if (e.key === ' ') {
            e.preventDefault();
        }
    };
    const inputRef = useRef();

    const handleChange = (e) => {
        let newValue = e.target.value;
        onChange(newValue,inputKey);  
        setTimeout(() =>{             
            if(newValue === inputRef.current.value){
                newValue = decimalsAllowed ? parseFloat(newValue) : parseInt(newValue);
                newValue = !isNaN(newValue) ? newValue : min; 
                if (newValue < min)
                    newValue = min;
                else if (newValue > max)
                    newValue = max; 

                    onChange(newValue,inputKey);               
            }
        },560); 

    };

    return (
        <Fragment>
            <div className={classes.root}>
                <input
                    aria-label={formatMessage({
                        id: 'quantity.input',
                        defaultMessage: 'Item Quantity'
                    })}
                    data-cy="QuantityStepper-input"
                    className={classes.input}
                    disabled={disabled}
                    field={fieldName}
                    id={itemId}
                    min={min}
                    max={max}
                    onBlur={onBlur}
                    onClick={handleFocus}
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    pattern="[0-9]*"
                    value={value}
                    maxLength={30}
                    ref={inputRef}
                />
            </div>
            {errorMessage}
        </Fragment>
    );
};

QuantityStepperSimple.propTypes = {
    decimalsAllowed: PropTypes.bool,
    disabled: PropTypes.bool,
    fieldName: PropTypes.string.isRequired,
    inputKey: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    itemId: PropTypes.string,
    message: PropTypes.string,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
};

QuantityStepperSimple.defaultProps = {
    decimalsAllowed: false,
    disabled: false,
    fieldName: 'quantity',
    min: 1,
    max: 1000,
    onChange: () => {},
    onBlur: () => {},
    value: 1
};

export default QuantityStepperSimple;
