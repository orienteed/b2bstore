import React from 'react';
import Field from '../../../Field';
import { isRequired } from '../../../../util/formValidators';
import Select from '../../../Select';
import { useStyle } from '../../../../classify';
import defaultClasses from './selectRma.module.css';

const SelectRma = props => {
    const classes = useStyle(defaultClasses);
    const { label, id, isSelected, ...rest } = props;
    return (
        <>
            {isSelected ? (
                <Field id={id} label={label}>
                    <span className={classes.selectedText}>{String(isSelected)} </span>
                    <Select {...rest} validate={isSelected && isRequired} />
                </Field>
            ) : (
                <Field id={id} label={label}>
                    <Select {...rest} />
                </Field>
            )}
        </>
    );
};

export default SelectRma;
