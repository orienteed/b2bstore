import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './savedCartPopup.module.css';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import Dialog from '@magento/venia-ui/lib/components/Dialog';
import Field from '@magento/venia-ui/lib/components/Field';
import TextArea from '@magento/venia-ui/lib/components/TextArea';
import TextInput from '@magento/venia-ui/lib/components/TextInput';

const savedCartPopup = props => {
    const { isOpen, onCancel, handleSubmit, errorMessage, isError, shouldDisableAllButtons } = props;

    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const cartNameLabel = (
        <>
            <FormattedMessage id={'orienteedsavecart.cartName'} defaultMessage={'Cart Name'} />
            <span className={classes.cartNameUniqueLabel}>
                <FormattedMessage id={'orienteedsavecart.orienteedsavecart'} defaultMessage={'( Must be unique )'} />
            </span>
        </>
    );

    const cartDescriptionLabel = formatMessage({
        id: 'orienteedsavecart.cartDescription',
        defaultMessage: 'Description'
    });

    const saveCartPopuptitle = formatMessage({
        id: 'orienteedsavecart.title',
        defaultMessage: 'Save Cart'
    });

    const containerClass = isError ? classes.saveCartname_error : classes.saveCartname;

    const nameTextInput = !isError ? (
        <TextInput field="orienteedsavecart_name" validate={isRequired} />
    ) : (
        <TextInput field="orienteedsavecart_name" validate={isRequired} message={errorMessage} />
    );

    return (
        <Dialog
            confirmTranslationId={'global.save'}
            confirmText="Save"
            isOpen={isOpen}
            onCancel={onCancel}
            onConfirm={handleSubmit}
            title={saveCartPopuptitle}
            shouldDisableAllButtons={shouldDisableAllButtons}
        >
            <div className={classes.root}>
                <div className={containerClass}>
                    <Field id="orienteedsavecart-name" label={cartNameLabel}>
                        {nameTextInput}
                    </Field>
                </div>
                <div className={classes.saveCartDescription}>
                    <Field id="orienteedsavecart-description" label={cartDescriptionLabel}>
                        <TextArea field="orienteedsavecart_description" validate={isRequired} />
                    </Field>
                    <div className={classes.saveCartDescriptionNote}>
                        <FormattedMessage
                            id={'saveCartDescription.descriptionNote'}
                            defaultMessage={'Maximum number of characters must be between 1 and 255'}
                        />
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default savedCartPopup;

savedCartPopup.propTypes = {
    classes: shape({
        root: string
    }),
    isOpen: bool,
    onCancel: func
};
