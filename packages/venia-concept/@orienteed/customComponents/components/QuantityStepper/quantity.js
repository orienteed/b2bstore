import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';
import { Form } from 'informed';
import { func, number, string } from 'prop-types';

import { useQuantityStepper } from '@magento/peregrine/lib/talons/QuantityStepper/useQuantityStepper';

import { useStyle } from '@magento/venia-ui/lib/classify';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { Message } from '@magento/venia-ui/lib/components/Field';
import defaultClasses from '@magento/venia-ui/lib/components/QuantityStepper/quantityStepper.module.css';

export const QuantityStepper = props => {
    const {
        initialValue,
        itemId,
        min,
        onChange,
        message,
        fieldName = 'quantity'
    } = props;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);

    const talonProps = useQuantityStepper({
        initialValue,
        min,
        onChange,
        fieldName
    });

    const { handleBlur, maskInput } = talonProps;

    const errorMessage = message ? <Message>{message}</Message> : null;

    return (
        <Fragment>
            <div className={classes.root}>
                <label className={classes.label} htmlFor={itemId}>
                    {label}
                </label>

                <TextInput
                    aria-label={formatMessage({
                        id: 'quantity.input',
                        defaultMessage: 'Item Quantity'
                    })}
                    data-cy="QuantityStepper-input"
                    classes={{ input: classes.input }}
                    field="quantity"
                    id={itemId}
                    inputMode="numeric"
                    mask={maskInput}
                    min={min}
                    onBlur={handleBlur}
                    pattern="[0-9]*"
                />
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
            <QuantityStepper {...props} />
        </Form>
    );
};

Quantity.propTypes = {
    initialValue: number,
    itemId: string,
    label: string,
    min: number,
    onChange: func,
    message: string,
    fieldName: string
};

Quantity.defaultProps = {
    label: 'Quantity',
    min: 0,
    initialValue: 1,
    onChange: () => {},
    fieldName: 'quantity'
};

QuantityStepper.defaultProps = {
    min: 0,
    initialValue: 1,
    onChange: () => {}
};

export default QuantityStepper;
