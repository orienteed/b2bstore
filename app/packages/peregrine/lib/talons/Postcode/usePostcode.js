import { useEffect, useRef, useState } from 'react';
import { useFieldApi } from 'informed';
import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';
import { validatePostcode } from '@magento/venia-ui/lib/util/formValidators';

/**
 * The usePostcode talon handles logic for resetting the postcode field value when the country changes.
 *
 * @param {Object} props
 * @param {string} props.countryCodeField
 * @param {string} props.fieldInput - the reference field path for free form text input Defaults to "postcode".
 *
 * @return {PostcodeTalonProps}
 */
export const usePostcode = props => {
    const { countryCodeField = 'country_code', fieldInput = 'postcode' } = props;
    const [warning, setWarning] = useState('');
    const hasInitialized = useRef(false);
    const countryFieldState = useFieldState(countryCodeField);
    const { value: country } = countryFieldState;

    const postcodeInputFieldApi = useFieldApi(fieldInput);
    const postcodeFieldState = useFieldState(fieldInput);
    const { value: postcode } = postcodeFieldState;

    useEffect(() => {
        if (postcode && country) {
            validatePostcode(postcode, country) ? setWarning('') : setWarning('Invalid postcode for the selected country.');
        }
    }, [postcode, country]);

    // Reset postcode when country changes. Because of how Informed sets
    // initialValues, we want to skip the first state change of the value being
    // initialized.
    useEffect(() => {
        if (country) {
            if (hasInitialized.current) {
                postcodeInputFieldApi.reset();
            } else {
                hasInitialized.current = true;
            }
        }
    }, [country, postcodeInputFieldApi]);

    return {
        warning,
    };
};

/** JSDocs type definitions */

/**
 * @typedef {Object} PostcodeTalonProps
 */

