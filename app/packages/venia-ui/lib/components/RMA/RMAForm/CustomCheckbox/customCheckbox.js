import React, { Fragment, useEffect } from 'react';
import { node, shape, string } from 'prop-types';
import { Checkbox as InformedCheckbox, useFieldApi } from 'informed';
import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';
import { FormattedMessage } from 'react-intl';
import { useStyle } from '@magento/venia-ui/lib/classify.js';
import { Message } from '../../../Field';
import { CheckSquare, Square } from 'react-feather';
import defaultClasses from './customCheckbox.module.css';
import { Link } from 'react-router-dom';
/* TODO: change lint config to use `label-has-associated-control` */
/* eslint-disable jsx-a11y/label-has-for */

const checkedIcon = <CheckSquare />;
const uncheckedIcon = <Square />;

const CustomCheckbox = props => {
    const { ariaLabel, classes: propClasses, field, fieldValue, id, label, message, ...rest } = props;
    const fieldApi = useFieldApi(field);
    const fieldState = useFieldState(field);
    const classes = useStyle(defaultClasses, propClasses);
    const icon = fieldState.value ? checkedIcon : uncheckedIcon;

    useEffect(() => {
        if (fieldValue != null && fieldValue !== fieldState.value) {
            fieldApi.setValue(fieldValue);
        }
    }, [fieldApi, fieldState.value, fieldValue]);
    // const accept = <FormattedMessage id={'footer.accept'} defaultMessage={`I accept `} />;
    const termsAndConditions = (
        <FormattedMessage
            id={'rmaRequestForm.termsAndConditions'}
            defaultMessage={`By clicking submit you agree to the Terms and Conditions.`}
        />
    );

    return (
        <Fragment>
            <div className={classes.container}>
                <div className={classes.iconContainer}>
                    <label data-cy="Checkbox-label" aria-label={ariaLabel} className={classes.root} htmlFor={id}>
                        <InformedCheckbox {...rest} className={classes.input} field={field} id={id} />
                        <span className={classes.icon}>{icon}</span>
                    </label>
                </div>
                <div className={classes.dataPoliticsContainer}>
                    {/* <span className={classes.label}>{accept} </span> */}
                    <Link to="/">
                        <span className={classes.dataPolitics}>{termsAndConditions}</span>
                    </Link>
                </div>
            </div>
            <Message fieldState={fieldState}>{message}</Message>
        </Fragment>
    );
};

export default CustomCheckbox;

CustomCheckbox.propTypes = {
    ariaLabel: string,
    classes: shape({
        icon: string,
        input: string,
        label: string,
        message: string,
        root: string
    }),
    field: string.isRequired,
    id: string,
    label: node.isRequired,
    message: node
};

/* eslint-enable jsx-a11y/label-has-for */
