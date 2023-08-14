import React from 'react';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import Dialog from '@magento/venia-ui/lib/components/Dialog';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { useIntl } from 'react-intl';
import defaultClasses from './stockAlert.module.css';
import { useStyle } from '../../../classify';
import { useUserContext } from '@magento/peregrine/lib/context/user';

const StockAlert = props => {
    const [{ isSignedIn }] = useUserContext();
    const { onCancel, isOpen, formProps, onConfirm: submitStockAlert, alertConfig } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const modalTextInfo = formatMessage({
        id: 'productAlerts.infoText',
        defaultMessage:
            'Subscribe  for product availability. Register your email address to be the first to know when our product has any changes in availability. You are always updated to get product availability!'
    });
    const modalButtonText = formatMessage({
        id: 'productAlert.NotifyMe',
        defaultMessage: 'Notify me'
    });
    const modalHeadingText = formatMessage({
        id: 'productAlerts.stockAlertModal',
        defaultMessage: 'Stay tuned for any updates on this products availability!'
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
                onConfirm={submitStockAlert}
                isOpen={isOpen}
                confirmTextButton={modalButtonText}
                title={modalHeadingText}
            >
                <hr />
                <p className={classes.textInfo}>{modalTextInfo}</p>
                {!isSignedIn && (
                    <Field id="email" label={modalEmailPlaceHolder}>
                        <TextInput
                            placeholder={modalEmailPlaceHolder}
                            field="email"
                            validate={!isSignedIn && isRequired}
                            data-cy="email"
                        />
                    </Field>
                )}
                <p className={classes.textInfo}>{modalFooterContent}</p>
            </Dialog>
        </>
    );
};

export default StockAlert;
