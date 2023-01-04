import React, { useState } from 'react';
import Field from '../../Field';
import TextInput from '../../TextInput';
import useRMA from '@magento/peregrine/lib/talons/RMA/useRMA';
import defaultClasses from './RMAForm.module.css';
import Button from '../../Button';
import TextArea from '../../TextArea';
import { Form } from 'informed';
import { FormattedMessage, useIntl } from 'react-intl';
import { useStyle } from '../../../classify';
import { isRequired } from '../../../util/formValidators';
import Dropzone from './Dropzone/dropzone';
import ImagesList from './ImagesList';
import { useRMAFormContext } from './RMAFormProvider/RMAFormProvider';
import Trigger from '../../Trigger';
import Icon from '../../Icon';
import { Smile as EmojiPickerIcon } from 'react-feather';
import Select from './SelectField/select';

const RMAForm = props => {
    const talonProps = useRMA({
        initialValues: props.initialValues || {}
    });
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const {
        handleSubmit,
        filesUploaded,
        setFilesUploaded,
        setDropzoneError,
        isEmojiPickerOpen,
        comment,
        setComment,
        handleClose,
        formProps
    } = talonProps;
    const orderInformationTitle = formatMessage({
        id: 'rmaRequestForm.orderInformationTitle',
        defaultMessage: 'Order Information'
    });
    const attachmentButton = (
        <Trigger action={() => {}}>
            <Dropzone
                filesUploaded={filesUploaded}
                setFilesUploaded={setFilesUploaded}
                setDropzoneError={setDropzoneError}
                // isTicketClosed={isTicketClosed}
            />
        </Trigger>
    );
    const emojiPickerButton = (
        <Trigger action={() => {}}>
            {isEmojiPickerOpen ? (
                <img className={classes.emojiPickerIcon} src={closeIcon} alt="Close icon" />
            ) : (
                <Icon src={EmojiPickerIcon} size={25} classes={classes.emojiPickerIconEnabled} />
            )}
        </Trigger>
    );

    const mockArray = [
        { value: 'select1' },
        { value: 'select2' },
        { value: 'select3' },
        { value: 'select4' },
        { value: 'select5' }
    ];

    const defaultTextDropzone = formatMessage({
        id: 'rmaRequestForm.orderDefaultTextDropzone',
        defaultMessage: 'Drag and drop your images'
    });

    const orderIdTitle = formatMessage({
        id: 'rmaRequestForm.orderIdTitle',
        defaultMessage: 'Order Id'
    });
    return (
        <div>
            <Form
                className={classes.form}
                onSubmit={handleSubmit}
                data-cy="RMARequestForm-form"
                initialValues={formProps}
            >
                <div className={classes.orderInformationContainer}>
                    <div className={classes.orderInformationTitle}>{orderInformationTitle}</div>
                    <hr />
                    <div className={classes.orderInformationInputs}>
                        <div className={classes.orderIdTitle}>{orderIdTitle}</div>
                        <div className={classes.productsSelect}>
                            <Select
                                initialValue={'Item'}
                                field="selection"
                                items={mockArray}
                                // onChange={onChangeVariant}
                            />
                        </div>
                        <Field
                            id="rmaRequestFormBillingName"
                            label={formatMessage({
                                id: 'rmaRequestForm.billingName',
                                defaultMessage: 'Billing Name'
                            })}
                        >
                            <TextInput
                                id="rmaRequestFormBillingName"
                                data-cy="RMARequestForm-name"
                                autoComplete="name"
                                field="name"
                                validate={isRequired}
                            />
                        </Field>
                        <Field
                            id="rmaRequestFormEmail"
                            label={formatMessage({
                                id: 'rmaRequestForm.email',
                                defaultMessage: 'Email address'
                            })}
                        >
                            <TextInput
                                id="rmaRequestFormEmail"
                                data-cy="rmaRequestFormEmail-email"
                                autoComplete="email"
                                field="email"
                                validate={isRequired}
                            />
                        </Field>

                        <Field
                            id="rmaRequestFormComment"
                            label={formatMessage({
                                id: 'rmaRequestForm.Comment',
                                defaultMessage: 'Comment'
                            })}
                        >
                            <TextArea
                                id="rmaRequestFormComment"
                                field="comment"
                                value={comment}
                                maxLength={10000}
                                onChange={e => setComment(e.target.value)}
                            />
                        </Field>
                        <div className={classes.dropZoneContainer}>
                            {/* <Dropzone /> */}
                            <TextInput
                                disabled
                                id="chatTextInput"
                                field="dropzone"
                                placeholder={'Attach your images'}
                                classes={classes.dropZoneInput}
                                before={emojiPickerButton}
                                maxLength={10000}
                                after={attachmentButton}
                                supportEmoji={true}
                                value={defaultTextDropzone}
                                onChange={e => {
                                    setComment(e.target.value);
                                }}
                                classes={classes.dropZone}
                                autoComplete="off"
                            />
                        </div>
                        <ImagesList filesUploaded={filesUploaded} handleClose={handleClose} />
                    </div>
                </div>
                <div className={classes.rmaInformationContainer}>
                    <Button priority="high" type="submit" data-cy="RMARequestForm-root_highPriority">
                        <FormattedMessage id={'rmaRequestForm.rmaRequestFormText'} defaultMessage={'Request'} />
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default RMAForm;
