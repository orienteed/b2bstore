import React from 'react';
import { useIntl } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import Dialog from '../../../Dialog';
import Field from '../../../Field';
import Country from '../../../Country';
import Postcode from '../../../Postcode';
import Region from '../../../Region';
import TextInput from '../../../TextInput';
import defaultClasses from './editCompanyInfo.module.css';

const EditCompanyInfoModal = ({ onCancel, isOpen, onConfirm, formProps, editType }) => {
    const classes = useStyle(defaultClasses);
    const { formatMessage } = useIntl();
    const CompanyNameLabel = formatMessage({
        id: 'companyAccount.companyName',
        defaultMessage: 'Company Name'
    });

    const CompanyLegalNameLabel = formatMessage({
        id: 'companyLegalName',
        defaultMessage: 'Company Legal Name'
    });
    const CompanyEmaiLabel = formatMessage({
        id: 'companyAccount.companyEmail',
        defaultMessage: 'Company Email'
    });
    const CompanyVatLabel = formatMessage({
        id: 'companyAccount.vatTaxID',
        defaultMessage: 'Vat/Tax ID'
    });
    const CompanyResellerLabel = formatMessage({
        id: 'companyAccount.companyResellerID',
        defaultMessage: 'Reseller ID'
    });
    const CompanyStreetLabel = formatMessage({
        id: 'companyAccount.street',
        defaultMessage: 'Street'
    });
    const CompanyCityLabel = formatMessage({
        id: 'companyAccount.city',
        defaultMessage: 'City'
    });
    const CompanyPhoneLabel = formatMessage({
        id: 'companyAccount.phoneNumber',
        defaultMessage: 'Phone Number'
    });
    const editInfoLabel = formatMessage({
        id: 'companyAccount.editCompanyInformation',
        defaultMessage: 'Edit Company Information'
    });
    const editAddressLabel = formatMessage({
        id: 'companyAccount.editCompanyAddress',
        defaultMessage: 'Edit Company Adress'
    });
    const modalTitle = editType === 'infoData' ? editInfoLabel : editAddressLabel;
    return (
        <>
            <Dialog
                formProps={formProps}
                confirmTranslationId={'global.save'}
                onCancel={onCancel}
                onConfirm={onConfirm}
                isOpen={isOpen}
                confirmText="Save"
                title={modalTitle}
            >
                <div className={classes.root} data-cy="AddEditDialog-root">
                    <div className={editType == 'infoData' ? '' : classes.noDisplay}>
                        <div className={classes.firstname}>
                            <Field id="name" label={CompanyNameLabel}>
                                <TextInput field="name" validate={isRequired} data-cy="name" />
                            </Field>
                        </div>
                        <div className={classes.legal_name}>
                            <Field id="legal_name" label={CompanyLegalNameLabel}>
                                <TextInput field="legal_name" data-cy="legal_name" />
                            </Field>
                        </div>
                        <div className={classes.email}>
                            <Field id="email" label={CompanyEmaiLabel}>
                                <TextInput field="email" data-cy="email" />
                            </Field>
                        </div>
                        <div className={classes.vat_id}>
                            <Field id="vat_id" label={CompanyVatLabel}>
                                <TextInput field="vat_id" data-cy="vat_id" />
                            </Field>
                        </div>
                        <div className={classes.reseller_id}>
                            <Field id="reseller_id" label={CompanyResellerLabel}>
                                <TextInput field="reseller_id" data-cy="reseller_id" />
                            </Field>
                        </div>
                    </div>
                    <div className={editType !== 'infoData' ? '' : classes.noDisplay}>
                        <div className={classes.street}>
                            <Field id="street" label={CompanyStreetLabel}>
                                <TextInput field="street" validate={isRequired} data-cy="street" />
                            </Field>
                        </div>
                        <div className={classes.city}>
                            <Field id="city" label={CompanyCityLabel}>
                                <TextInput field="city" validate={isRequired} data-cy="city" />
                            </Field>
                        </div>
                        <div className={classes.country}>
                            <Country field={'country_id'} validate={isRequired} data-cy="country_id" />
                        </div>
                        <div className={classes.region}>
                            <Region
                                countryCodeField={'country_id'}
                                fieldInput={'region'}
                                fieldSelect={'region_id'}
                                optionValueKey="id"
                                validate={isRequired}
                                data-cy="region_id"
                            />
                        </div>
                        <div className={classes.postcode}>
                            <Postcode validate={isRequired} data-cy="postcode" />
                        </div>
                        <div className={classes.telephone}>
                            <Field id="telephone" label={CompanyPhoneLabel}>
                                <TextInput field="telephone" validate={isRequired} data-cy="telephone" />
                            </Field>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default EditCompanyInfoModal;
