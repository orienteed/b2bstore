import React from 'react';
import Dialog from '@magento/venia-ui/lib/components/Dialog';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import { useIntl } from 'react-intl';
import Country from '../../Country';
import Region from '../../Region';
import Postcode from '../../Postcode';

const CreateCompanyModal = ({ onCancel, isOpen, onConfirm, formProps }) => {
    const { formatMessage } = useIntl();

    const firstNameLabel = formatMessage({
        id: 'companyAccount.firstName',
        defaultMessage: 'First Name'    
    });

    const CompanyEmaiLabel = formatMessage({
        id: 'global.email',
        defaultMessage: 'Email'
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

    const CompanyLegalNameLabel = formatMessage({
        id: 'companyLegalName',
        defaultMessage: 'Company Legal Name'
    });
    return (
        <>
            <Dialog
                title={'Create your company account'}
                onCancel={onCancel}
                confirmText="Save"
                isOpen={isOpen}
                onConfirm={onConfirm}
                formProps={formProps}
            >
                <div>
                    <div />
                    <>
                        <div>
                            <Field id="name" label={firstNameLabel}>
                                <TextInput field="name" validate={isRequired} data-cy="firstname" />
                            </Field>
                        </div>
                        <div>
                            <Field id="legal_name" label={CompanyLegalNameLabel}>
                                <TextInput field="legal_name" data-cy="legal_name" />
                            </Field>
                        </div>
                        <div>
                            <Field id="email" label={CompanyEmaiLabel}>
                                <TextInput disabled validate={isRequired} field="email" data-cy="email" />
                            </Field>
                        </div>
                        <div>
                            <Field id="vat_id" label={CompanyVatLabel}>
                                <TextInput field="vat_id" data-cy="vat_id" />
                            </Field>
                        </div>
                        <div>
                            <Field id="reseller_id" label={CompanyResellerLabel}>
                                <TextInput field="reseller_id" data-cy="reseller_id" />
                            </Field>
                        </div>
                        <div>
                            <Field id="street" label={CompanyStreetLabel}>
                                <TextInput field="street" validate={isRequired} data-cy="street" />
                            </Field>
                        </div>
                        <div>
                            <Field id="city" label={CompanyCityLabel}>
                                <TextInput field="city" validate={isRequired} data-cy="city" />
                            </Field>
                        </div>
                        <div>
                            <Country field={'country_id'} validate={isRequired} data-cy="country_id" />
                        </div>
                        <div>
                            <Region
                                countryCodeField={'country_id'}
                                fieldInput={'region'}
                                fieldSelect={'region_id'}
                                optionValueKey="id"
                                validate={isRequired}
                                data-cy="region_id"
                            />
                        </div>
                        <div>
                            <Postcode validate={isRequired} data-cy="postcode" />
                        </div>
                        <div>
                            <Field id="telephone" label={CompanyPhoneLabel}>
                                <TextInput field="telephone" validate={isRequired} data-cy="telephone" />
                            </Field>
                        </div>
                    </>
                </div>
            </Dialog>
        </>
    );
};

export default CreateCompanyModal;
