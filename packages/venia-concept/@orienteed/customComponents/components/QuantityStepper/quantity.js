import React, { Fragment } from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { Message } from '@magento/venia-ui/lib/components/Field';
import defaultClasses from './quantity.module.css';

export const QuantityStepper = props => {
    const {
        itemId,
        min,
        onChange,
        value,
        message,
        fieldName = 'quantity'
    } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const errorMessage = message ? <Message>{message}</Message> : null;
    const handleKeyDown = e => {
        if (e.key === ' ') {
            e.preventDefault();
        }
    };
    const handleChange = e => onChange(e.target.value);
    return (
        <Fragment>
            <div className={classes.root}>
                <input
                    field={fieldName}
                    onKeyDown={handleKeyDown}
                    data-cy="QuantityStepper-input"
                    className={classes.input}
                    id={itemId}
                    value={value}
                    min={min}
                    onChange={handleChange}
                    // pattern="[0-9]*"
                />
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
