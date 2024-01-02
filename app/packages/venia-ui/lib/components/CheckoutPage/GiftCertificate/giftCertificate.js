import React, { useMemo, useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { bool, func, shape, string } from 'prop-types';

import { isRequired } from '../../../util/formValidators';
import Button from '../../Button';
import Field from '../../Field';
import TextInput from '../../TextInput';
import { useStyle } from '../../../classify';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';
import { useGiftCertificate } from './useGiftCertificate';

import { useState } from 'react';

import defaultClasses from './giftCertificate.module.css';

//This view is based on the behavior that gift certificates have on bigcommerce storefront.
//BigCommerce recognice gift certificates as a payment method, so this view will be triggered in the payment methods selector in the checkout page.
//This view is triggered when calling to 'giftcertificate' code in app/packages/venia-ui/lib/targets/venia-ui-intercept.js
//TODO: Solve REST endpoint CORS not allowing POST method (see applyGiftCardToCart resolver)
//After solving endpoint issue:
//TODO: When calling REST endpoint to add gift certificate to cart, retreive certificate data to show it in the views table (I hardcoded an example with <table> tag)
//TODO: When calling the endpoint, there should be a loading view while the data is not retreived (you can use app/packages/venia-ui/lib/components/CheckoutPage/PaymentInformation/creditCard.js as reference).
const GiftCertificate = props => {
    const isFieldRequired = useCallback((value) => {
        return isRequired(value);
    }, []);
    
    const {
        classes: propClasses,
    } = props;
    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, propClasses);

    const { applyGiftCardToCart: applyGiftCardToCartFromAdapter } = useAdapter();

    //Calling useGiftCertificate class to use applyGiftCardToCart resolver
    const talonProps = useGiftCertificate({
        applyGiftCardToCartFromAdapter
    });

    const { useGift } = talonProps;

    const [giftCode, setGiftCode] = useState('');

    const handleApplyGift = () => {
        console.log(giftCode)
        useGift(giftCode);
      };

    return (
        <div className={classes.root}>
            <div>
                <div className={classes.gift_code}>
                    {/* <Field
                    //TODO: solve Incorrect use of <label for=FORM_ELEMENT> (inside DevTools -> Issues when activate this class)
                    //TODO: swap hardcoded values from the table to a new ones extracted from the endpoint
                        id="giftCerts"
                        label={formatMessage({
                            id: 'giftCertificate.giftCerts', 
                            defaultMessage: 'Your Gift certificates:'
                        })}>
                        <table className={classes.giftTable}>
                            <thead>
                                <tr>
                                    <th scope="col">
                                        <FormattedMessage
                                            id={'giftCertificate.giftCode'}
                                            defaultMessage={'Gift Code'}
                                        />
                                    </th>
                                    <th scope="col">
                                        <FormattedMessage
                                            id={'giftCertificate.amount'}
                                            defaultMessage={'Amount'}
                                        />
                                    </th>
                                    <th scope="col">
                                        <FormattedMessage
                                            id={'giftCertificate.remainingAmount'}
                                            defaultMessage={'Remaining Amount'}
                                        />
                                    </th>
                                    <th scope="col">
                                        <FormattedMessage
                                            id={'giftCertificate.message'}
                                            defaultMessage={'Message'}
                                        />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td
                                        data-label={formatMessage({
                                            id: 'giftCertificate.giftCode',
                                            defaultMessage: 'Gift Code'
                                        })}
                                    >
                                        2LI-615-46W-YGG
                                    </td>
                                    <td
                                        data-label={formatMessage({
                                            id: 'giftCertificate.amount',
                                            defaultMessage: 'Amount'
                                        })}
                                    >
                                        5€
                                    </td>
                                    <td
                                        data-label={formatMessage({
                                            id: 'giftCertificate.remainingAmount',
                                            defaultMessage: 'Remaining Amount'
                                        })}
                                    >
                                        2€
                                    </td>
                                    <td
                                        data-label={formatMessage({
                                            id: 'giftCertificate.message',
                                            defaultMessage: 'Message'
                                        })}
                                    >
                                        Certificado regalo de 481.36 rublos
                                    </td>
                                </tr>
                            </tbody>
                    </table> 
                    </Field>
                    */}
                    
                    <Field
                        id="giftCode"
                        label={formatMessage({
                            id: 'global.giftCode',
                            defaultMessage: 'Gift code'
                        })}
                    >
                        <TextInput
                            id="giftCode"
                            field="giftCode"
                            placeholder='XXX-XXX-XXX-XXX'
                            validate={value => isFieldRequired(value)}
                            onChange={(event) => setGiftCode(event.target.value)}
                        />
                        <Button 
                        label={formatMessage({
                            id: 'global.btn',
                            defaultMessage: 'btn' 
                        })}
                        className={classes.addButton}
                        //Triggering the resolver
                        onClick={handleApplyGift}
                        >APPLY</Button>
                    </Field>
                </div>
            </div>
        </div>
    );
};

export default GiftCertificate;

GiftCertificate.propTypes = {
    classes: shape({
        root: string,
        first_name: string,
    }),
    shouldSubmit: bool.isRequired,
    resetShouldSubmit: func.isRequired
};
