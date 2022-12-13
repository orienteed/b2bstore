/* eslint-disable react/jsx-no-literals */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Suspense } from 'react';
import { useStyle } from '../../../classify';
import { FormattedMessage } from 'react-intl';
import SideMenu from '../SideMenu';
import defaultClasses from './companyInfo.module.css';
import FullPageLoadingIndicator from '../../LoadingIndicator';
import { useCompanyAccountInfo } from '@magento/peregrine/lib/talons/CompanyAccount/useCompanyAccountInfo';
import EditImage from '../../images/edit.svg';
const EditModal = React.lazy(() => import('./EditCompanyInfo'));

const CompanyInfo = () => {
    const classes = useStyle(defaultClasses);
    const {
        companyInfo,
        submitEdit,
        companyInfoLoading,
        handleEditbtn,
        openEditModal,
        formProps,
        editType,
        handelCancelModal
    } = useCompanyAccountInfo({});
    const mpCompanyAccounts = companyInfo?.mpCompanyAccounts || {};
    const {
        name,
        legal_name,
        email,
        vat_id,
        reseller_id,
        street,
        city,
        country_id,
        region,
        postcode,
        telephone
    } = mpCompanyAccounts;
    if (companyInfoLoading) {
        return <FullPageLoadingIndicator />;
    }
    const DataRow = ({ labelId, labelVal, value }) => (
        <div className={classes.dataRow}>
            <span className={classes.dataLabel}>
                <FormattedMessage id={labelId} defaultMessage={labelVal} />:
            </span>{' '}
            {value}
        </div>
    );
    return (
        <>
            <div>
                <div className={classes.titleContainer}>
                    <h2>
                        <FormattedMessage id={'companyAccount.myCompany'} defaultMessage="My Company" />
                    </h2>
                </div>
                <div className={classes.contentContainer}>
                    <div>
                        <SideMenu />
                    </div>
                    <div className={classes.InfoContainer}>
                        <div className={classes.InfoSection}>
                            <div className={classes.sectionTitle}>
                                <h3>
                                    <FormattedMessage id={'companyAccount.companyInfo'} defaultMessage="Company Info" />
                                </h3>
                            </div>
                            <div className={classes.dataSection}>
                                <DataRow
                                    labelId={'companyAccount.companyName'}
                                    labelVal={'Company name'}
                                    value={name}
                                />
                                <DataRow
                                    labelId={'companyAccount.companyLegalName'}
                                    labelVal={'Company Legal Name'}
                                    value={legal_name}
                                />
                                <DataRow
                                    labelId={'companyAccount.companyEmail'}
                                    labelVal={'Company Email'}
                                    value={email}
                                />
                                <DataRow labelId={'companyAccount.vatTaxID'} labelVal={'Vat/Tax ID'} value={vat_id} />
                                <DataRow
                                    labelId={'companyAccount.companyResellerID'}
                                    labelVal={'Reseller ID'}
                                    value={reseller_id}
                                />
                            </div>
                            <span onClick={() => handleEditbtn('infoData')} className={classes.editBtn}>
                                <img alt="edit" src={EditImage} />{' '}
                                <FormattedMessage id={'companyAccount.edit'} defaultMessage="Edit" />
                            </span>
                        </div>
                        <div className={classes.InfoSection}>
                            <div className={classes.sectionTitle}>
                                <h3>
                                    <FormattedMessage
                                        id={'companyAccount.companyLegalAdress'}
                                        defaultMessage="Company Legal Adress"
                                    />
                                </h3>
                            </div>
                            <div className={classes.dataSection}>
                                <DataRow labelId={'companyAccount.street'} labelVal={'Street'} value={street} />
                                <DataRow labelId={'companyAccount.city'} labelVal={'City'} value={city} />
                                <DataRow labelId={'companyAccount.country'} labelVal={'Country'} value={country_id} />
                                <DataRow
                                    labelId={'companyAccount.stateProvinace'}
                                    labelVal={'State/Provinace'}
                                    value={region}
                                />
                                <DataRow
                                    labelId={'companyAccount.PostalCode'}
                                    labelVal={'Zip/Postal Code'}
                                    value={postcode}
                                />
                                <DataRow
                                    labelId={'companyAccount.phoneNumber'}
                                    labelVal={'Phone Number'}
                                    value={telephone}
                                />
                            </div>
                            <span onClick={() => handleEditbtn('addressData')} className={classes.editBtn}>
                                <img alt="edit" src={EditImage} />{' '}
                                <FormattedMessage id={'companyAccount.edit'} defaultMessage="Edit" />
                            </span>
                        </div>
                        <div className={classes.InfoSection}>
                            <div className={classes.sectionTitle}>
                                <h3>
                                    <FormattedMessage id={'companyAccount.companyContact'} defaultMessage="Contact" />
                                </h3>
                            </div>
                            <div className={classes.dataSection}>
                                <DataRow
                                    labelId={'companyAccount.phoneNumber'}
                                    labelVal={'Phone Number'}
                                    value={telephone}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Suspense fallback={null}>
                <EditModal
                    editType={editType}
                    onCancel={handelCancelModal}
                    isOpen={openEditModal}
                    formProps={formProps}
                    onConfirm={submitEdit}
                />
            </Suspense>
        </>
    );
};

export default CompanyInfo;
