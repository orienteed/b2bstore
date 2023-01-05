import React, { Suspense } from 'react';
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
import Trigger from '../../Trigger';
import Select from '../../Select';
import { Accordion, Section } from '../../Accordion';
import Icon from '../../Icon';
import { Smile as EmojiPickerIcon } from 'react-feather';
import CustomCheckbox from './CustomCheckbox';
import LoadingIndicator from '../../LoadingIndicator';

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
        returnTypes,
        handleReturnChange,
        formProps,
        returnType,
        reasons,
        soluations,
        handleReasonChange,
        order
    } = talonProps;
    const orderInformationTitle = formatMessage({
        id: 'rmaRequestForm.orderInformationTitle',
        defaultMessage: 'Order Information'
    });
    const rmaInformation = formatMessage({
        id: 'rmaRequestForm.rmaInformation',
        defaultMessage: 'RMA Information'
    });
    const attachmentButton = (
        <Trigger action={() => {}}>
            <Dropzone
                filesUploaded={filesUploaded}
                setFilesUploaded={setFilesUploaded}
                setDropzoneError={setDropzoneError}
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
    const personalDataTreatment = formatMessage({
        id: 'rmaRequestForm.termsAndConditions',
        defaultMessage: 'By clicking submit you agree to the Terms and Conditions.'
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
                        <div className={classes.checkboxContainer}>
                            <CustomCheckbox
                                field="data_treatment"
                                label={personalDataTreatment}
                                validate={isRequired}
                            />
                        </div>
                        <div className={classes.dropZoneContainer}>
                            <TextInput
                                disabled
                                id="chatTextInput"
                                field="dropzone"
                                placeholder={'Attach your images'}
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
                    <div className={classes.orderInformationTitle}>{rmaInformation}</div>
                    <hr />
                    <div className={classes.rmaInformationInputs}>
                        <Field
                            id="rmaRequestFormreturnType"
                            label={formatMessage({
                                id: 'rmaRequestForm.returnType',
                                defaultMessage: 'Return Type'
                            })}
                        >
                            <Select onChange={handleReturnChange} field={'returnType'} items={returnTypes} />
                        </Field>
                        {returnType === 'allItems' ? (
                            <div className={classes.allItemsSection}>
                                <Field
                                    id="rmaRequestFormreturnType"
                                    label={formatMessage({
                                        id: 'rmaRequestForm.reason',
                                        defaultMessage: 'Reason'
                                    })}
                                >
                                    <Select field="reason" onChange={e => handleReasonChange(e)} items={reasons} />
                                </Field>
                                <Field
                                    id="rmaRequestFormreturnType"
                                    label={formatMessage({
                                        id: 'rmaRequestForm.solution',
                                        defaultMessage: 'Solution'
                                    })}
                                >
                                    <Select
                                        field={'soluation'}
                                        onChange={e => handleReasonChange(e)}
                                        items={soluations}
                                    />
                                </Field>
                            </div>
                        ) : (
                            <>
                                {order.products.map(item => (
                                    <div className={classes.item}>
                                        <Accordion canOpenMultiple={true}>
                                            <Section
                                                data-cy="PriceAdjustments-couponCodeSection"
                                                id={item.sku}
                                                title={item.name + ' ' + item.SKU}
                                            >
                                                <Suspense fallback={<LoadingIndicator />}>
                                                    <>
                                                        <div className={classes.flexDisplay}>
                                                            <span>
                                                                {' '}
                                                                <FormattedMessage
                                                                    id={'global.price'}
                                                                    defaultMessage={'Price'}
                                                                />
                                                            </span>
                                                            <span>{item.price}</span>
                                                        </div>
                                                        <div className={classes.flexDisplay}>
                                                            <span>
                                                                {' '}
                                                                <FormattedMessage
                                                                    id={'global.qty'}
                                                                    defaultMessage={'Quantity'}
                                                                />
                                                            </span>
                                                            <span>{item.qty}</span>
                                                        </div>
                                                        <Field
                                                            id="rmaRequestFormreturnType"
                                                            label={formatMessage({
                                                                id: 'rmaRequestForm.reason',
                                                                defaultMessage: 'Reason'
                                                            })}
                                                        >
                                                            <Select
                                                                field="reason"
                                                                onChange={e => handleReasonChange(e, item, returnType)}
                                                                items={reasons}
                                                            />
                                                        </Field>
                                                        <Field
                                                            id="rmaRequestFormreturnType"
                                                            label={formatMessage({
                                                                id: 'rmaRequestForm.solution',
                                                                defaultMessage: 'Solution'
                                                            })}
                                                        >
                                                            <Select
                                                                field={'soluation'}
                                                                onChange={e => handleReasonChange(e, item, returnType)}
                                                                items={soluations}
                                                            />
                                                        </Field>
                                                    </>
                                                </Suspense>
                                            </Section>
                                        </Accordion>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                    <Button priority="high" type="submit" data-cy="RMARequestForm-root_highPriority">
                        <FormattedMessage id={'rmaRequestForm.rmaRequestFormText'} defaultMessage={'Request'} />
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default RMAForm;
