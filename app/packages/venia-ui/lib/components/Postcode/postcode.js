import React from 'react';
import { shape, string } from 'prop-types';
import { useIntl } from 'react-intl';
import { usePostcode } from '../../../../peregrine/lib/talons/Postcode/usePostcode';

import { useStyle } from '../../classify';
import Field from '../Field';
import TextInput from '../TextInput';
import defaultClasses from './postcode.module.css';

const Postcode = props => {
    const { classes: propClasses, fieldInput, countryCodeField, label, ...inputProps } = props;

    const classes = useStyle(defaultClasses, propClasses);
    const postcodeProps = {
        classes,
        ...inputProps
    };

    const { formatMessage } = useIntl();

    const fieldLabel =
        label ||
        formatMessage({
            id: 'postcode.label',
            defaultMessage: 'ZIP / Postal Code'
        });

      const errorMessage = formatMessage({
        id: 'postcode.invalid',
        defaultMessage: 'Invalid postcode'
      })

    const { warning } = usePostcode({ fieldInput, countryCodeField });

    return (
      <>
        <Field
          id={classes.root}
          label={fieldLabel}
          classes={{ root: classes.root }}
        >
          <TextInput
            {...postcodeProps}
            field={fieldInput}
            id={classes.root}
          />
        </Field>
        {warning && <div className={classes.warning}>{errorMessage}</div>}
      </>
    );
};

export default Postcode;

Postcode.defaultProps = {
    fieldInput: 'postcode',
    countryCodeField: 'country_code'
};

Postcode.propTypes = {
    classes: shape({
        root: string
    }),
    fieldInput: string,
    label: string,
    countryCodeField: string
};

