/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/jsx-no-literals */
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
import Select from '../../Select';
import { Accordion, Section } from '../../Accordion';
import CustomCheckbox from './CustomCheckbox';
import Checkbox from '../../Checkbox';
import LoadingIndicator from '../../LoadingIndicator';
import DropzonePrevisualizer from '../DropzonePrevisualizer';
import { ArrowLeft } from 'react-feather';
import Icon from '../../Icon';
import { useHistory } from 'react-router-dom';

const RMAForm = props => {
    const history = useHistory();
    const handleBackPage = () => {
        history.push('/rma');
    };
    const talonProps = useRMA({
        initialValues: props.initialValues || {}
    });
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const {
        handleSubmit,
        comment,
        setComment,
        returnTypes,
        handleReturnChange,
        formProps,
        returnType,
        handleEachItemChange,
        customerOrderIds,
        orderId,
        handleChangeOrderId,
        filesUploaded,
        setFilesUploaded,
        handleSelectItem,
        customerOrders,
        infoReasonsData,
        infoSolutionData,
        customerData,
        handleReasonSolutionChange,
        reasonSolutionAdditionalFieldData,
        handleAdditionalFieldChange,
        selectedItems,
        setFormApi
    } = talonProps;

    console.log('selectedItems', selectedItems);
    const orderInformationTitle = formatMessage({
        id: 'rmaRequestForm.orderInformationTitle',
        defaultMessage: 'Order Information'
    });
    const rmaInformation = formatMessage({
        id: 'rmaRequestForm.rmaInformation',
        defaultMessage: 'RMA Information'
    });

    const orderIdTitle = formatMessage({
        id: 'rmaRequestForm.orderIdTitle',
        defaultMessage: 'Order Id'
    });
    const personalDataTreatment = formatMessage({
        id: 'rmaRequestForm.termsAndConditions',
        defaultMessage: 'By clicking submit you agree to the Terms and Conditions.'
    });

    const goToRequestList = formatMessage({
        id: 'rmaRequestForm.GoToRequestList',
        defaultMessage: 'Go to request list'
    });

    if (!customerOrders && !infoReasonsData && !infoSolutionData && !customerData) return <LoadingIndicator />;

    return (
        <div>
            <div className={classes.goToRequestListTitle} onClick={handleBackPage}>
                <div>
                    <Icon src={ArrowLeft} />
                </div>
                <p>{goToRequestList}</p>
            </div>
            <Form
                getApi={setFormApi}
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
                            {customerOrderIds && (
                                <Select
                                    initialValue={'Item'}
                                    field="selection"
                                    items={customerOrderIds}
                                    value={orderId}
                                    onChange={e => handleChangeOrderId(e.target.value)}
                                />
                            )}
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
                                field="name"
                                placeholder={customerData?.customer?.firstname}
                                disabled
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
                                field="email"
                                placeholder={customerData?.customer?.email}
                                disabled
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
                        <DropzonePrevisualizer filesUploaded={filesUploaded} setFilesUploaded={setFilesUploaded} />
                    </div>
                </div>
                <div className={orderId ? classes.rmaInformationContainer : classes.rmaInformationContainerHidden}>
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
                                    {infoReasonsData && (
                                        <Select
                                            field="reason"
                                            onChange={e => handleReasonSolutionChange(e)}
                                            value={infoReasonsData}
                                            items={infoReasonsData}
                                            validate={isRequired}
                                        />
                                    )}
                                </Field>
                                <Field
                                    id="rmaRequestFormreturnType"
                                    label={formatMessage({
                                        id: 'rmaRequestForm.solution',
                                        defaultMessage: 'Solution'
                                    })}
                                >
                                    {infoSolutionData && (
                                        <Select
                                            field={'solution'}
                                            onChange={e => handleReasonSolutionChange(e)}
                                            value={infoSolutionData}
                                            items={infoSolutionData}
                                            validate={isRequired}
                                        />
                                    )}
                                </Field>
                                <Field
                                    id="rmaRequestAdditionalField"
                                    label={formatMessage({
                                        id: 'rmaRequestForm.additionalField',
                                        defaultMessage: 'Additional Field'
                                    })}
                                />
                                {reasonSolutionAdditionalFieldData &&
                                    reasonSolutionAdditionalFieldData.mpRMAConfig.additional_field.map(field => {
                                        return (
                                            <Field
                                                id="rmaRequestAdditionalField"
                                                label={formatMessage({
                                                    id: 'rmaRequestForm.additionalField',
                                                    defaultMessage: field.content
                                                })}
                                            >
                                                <TextInput
                                                    id="rmaRequestAdditionalField"
                                                    data-cy="rmaRequestAdditionalField"
                                                    onChange={e =>
                                                        handleAdditionalFieldChange(e, field.content, field.value)
                                                    }
                                                    field={field.content}
                                                />
                                            </Field>
                                        );
                                    })}
                            </div>
                        ) : (
                            <>
                                {customerOrders?.map(item => (
                                    <div className={classes.item}>
                                        <Accordion canOpenMultiple={true}>
                                            <Checkbox
                                                onChange={() => handleSelectItem(item)}
                                                field={item.SKU}
                                                checked={selectedItems.length > 0}
                                            />
                                            <Section
                                                data-cy="PriceAdjustments-couponCodeSection"
                                                id={item?.sku}
                                                title={item?.name + ' ' + item?.SKU}
                                            >
                                                <Suspense fallback={<LoadingIndicator />}>
                                                    <>
                                                        <div className={classes.flexDisplay}>
                                                            <span>
                                                                <FormattedMessage
                                                                    id={'global.price'}
                                                                    defaultMessage={'Price'}
                                                                />
                                                            </span>
                                                            <span>{`${item?.price?.value}  ${
                                                                item?.price?.currency
                                                            }`}</span>
                                                        </div>
                                                        <div className={classes.flexDisplay}>
                                                            <span>
                                                                <FormattedMessage
                                                                    id={'global.qty'}
                                                                    defaultMessage={'Quantity'}
                                                                />
                                                            </span>
                                                            <span>{item?.qty_rma}</span>
                                                        </div>
                                                        <Field
                                                            id="rmaRequestFormreturnType"
                                                            label={formatMessage({
                                                                id: 'rmaRequestForm.reason',
                                                                defaultMessage: 'Reason'
                                                            })}
                                                        >
                                                            {infoReasonsData && (
                                                                <Select
                                                                    field={`reason ${item.product_id}`}
                                                                    onChange={e =>
                                                                        handleEachItemChange(
                                                                            e,
                                                                            item.product_id,
                                                                            'reason'
                                                                        )
                                                                    }
                                                                    items={infoReasonsData}
                                                                    validate={isRequired}
                                                                />
                                                            )}
                                                        </Field>
                                                        <Field
                                                            id="rmaRequestFormreturnType"
                                                            label={formatMessage({
                                                                id: 'rmaRequestForm.solution',
                                                                defaultMessage: 'Solution'
                                                            })}
                                                        >
                                                            {infoSolutionData && (
                                                                <Select
                                                                    field={`solution ${item.product_id}`}
                                                                    onChange={e =>
                                                                        handleEachItemChange(
                                                                            e,
                                                                            item.product_id,
                                                                            'solution'
                                                                        )
                                                                    }
                                                                    items={infoSolutionData}
                                                                    validate={isRequired}
                                                                />
                                                            )}
                                                        </Field>
                                                        {reasonSolutionAdditionalFieldData &&
                                                            reasonSolutionAdditionalFieldData.mpRMAConfig.additional_field.map(
                                                                field => {
                                                                    return (
                                                                        <Field
                                                                            id="rmaRequestAdditionalField"
                                                                            label={formatMessage({
                                                                                id: 'rmaRequestForm.additionalField',
                                                                                defaultMessage: field.content
                                                                            })}
                                                                        >
                                                                            <TextInput
                                                                                id="rmaRequestAdditionalField"
                                                                                data-cy="rmaRequestAdditionalField"
                                                                                field={`additional ${field.content}`}
                                                                                onChange={e =>
                                                                                    handleEachItemChange(
                                                                                        e,
                                                                                        item.product_id,
                                                                                        'content',
                                                                                        field.value
                                                                                    )
                                                                                }
                                                                            />
                                                                        </Field>
                                                                    );
                                                                }
                                                            )}
                                                    </>
                                                </Suspense>
                                            </Section>
                                        </Accordion>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                    <Button
                        priority="high"
                        type="submit"
                        data-cy="RMARequestForm-root_highPriority"
                        disabled={selectedItems.length === 0 && returnType !== 'allItems'}
                    >
                        <FormattedMessage id={'rmaRequestForm.rmaRequestFormText'} defaultMessage={'Request'} />
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default RMAForm;
