import React from 'react';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import Dialog from '@magento/venia-ui/lib/components/Dialog';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { useIntl } from 'react-intl';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import defaultClasses from './priceAlert.module.css';
import { useStyle } from '../../../classify';

const PriceAlert = props => {
    const [{ isSignedIn }] = useUserContext();
    const classes = useStyle(defaultClasses, props.classes);
    const { onCancel, isOpen, formProps, onConfirm: handleSubmitPriceAlert, alertConfig } = props;

    const { formatMessage } = useIntl();

    const modalTextInfo = formatMessage({
        id: 'productAlerts.infoText',
        defaultMessage:
            'Subscribe Price-Change Alerts now! Register your email address to be the first to know when our product has any changes in price. You are always updated to get product pricing goodness!'
    });
    const modalButtonText = formatMessage({
        id: 'productAlert.NotifyMe',
        defaultMessage: 'Notify me'
    });
    const modalHeadingText = formatMessage({
        id: 'productAlerts.modalFooterText',
        defaultMessage:
            '  Kindly notice that the back-in-stock email will be delivered only one time, and your email address will not be shared or published with anyone else.'
    });
    const modalFooterContent = formatMessage({
        id: 'productAlerts.modalFooterText',
        defaultMessage:
            '  Kindly notice that the back-in-stock email will be delivered only one time, and your email address will not be shared or published with anyone else.'
    });
    const modalEmailPlaceHolder = formatMessage({
        id: 'productAlerts.enterEmail',
        defaultMessage: 'Enter your email to get notified.'
    });
    return (
        <>
            <Dialog
                formProps={formProps}
                onCancel={onCancel}
                onConfirm={handleSubmitPriceAlert}
                isOpen={isOpen}
                title={modalHeadingText}
                confirmTextButton={modalButtonText}
            >
                <hr />
                <p className={classes.textInfo}>{modalTextInfo}</p>

                {!isSignedIn && (
                    <Field id="priceAlertFormEmail" label={modalEmailPlaceHolder}>
                        <TextInput
                            placeholder={modalEmailPlaceHolder}
                            id="priceAlertFormEmail"
                            data-cy="priceAlertFormEmail-email"
                            field="email"
                            validate={!isSignedIn && isRequired}
                        />
                    </Field>
                )}

                <p className={classes.textInfo}>{modalFooterContent}</p>
            </Dialog>
        </>
    );
};

export default PriceAlert;
