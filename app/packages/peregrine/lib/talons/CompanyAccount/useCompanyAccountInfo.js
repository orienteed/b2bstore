/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './company.gql';
import { useToasts } from '@magento/peregrine';
import { AlertCircle as AlertCircleIcon } from 'react-feather';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { useIntl } from 'react-intl';

const errorIcon = <Icon src={AlertCircleIcon} size={20} />;

export const useCompanyAccountInfo = props => {
    const { createCompanyData } = props;
    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [createModal, setCreateModal] = useState(false);
    const history = useHistory();
    const [editType, setEditType] = useState();
    const { registerCompany, companyData, updateCompayInfo } = operations;
    const [, { addToast }] = useToasts();

    const { formatMessage } = useIntl();
    const { data: companyInfo, loading: companyInfoLoading, refetch } = useQuery(companyData, {
        fetchPolicy: 'no-cache'
    });
    const [formAddress, setFormAddress] = useState();
    const [createCompany] = useState({ ...createCompanyData });
    const formProps = {
        initialValues: formAddress
    };

    const formCreateModal = {
        initialValues: createCompany
    };
    const [setRegisterCompany] = useMutation(registerCompany);

    const [setUpdateCompayInfo, { loading: UpdatecompanyLoading }] = useMutation(updateCompayInfo);
    useEffect(() => {
        if (companyInfo) {
            const { mpCompanyAccounts } = companyInfo;
            setFormAddress({ ...mpCompanyAccounts });
        }
    }, [companyInfo]);

    const handleEditbtn = editType => {
        setOpenEditModal(true);
        setEditType(editType);
    };

    const handelCancelModal = () => setOpenEditModal(false);

    const submitEdit = useCallback(
        async formValues => {
            try {
                const {
                    name,
                    legal_name,
                    email,
                    vat_id,
                    reseller_id,
                    street,
                    city,
                    region_id,
                    country_id,
                    postcode,
                    region,
                    telephone
                } = formValues;
                await setUpdateCompayInfo({
                    variables: {
                        name,
                        legal_name,
                        email,
                        vat_id,
                        reseller_id,
                        street,
                        city,
                        region_id: region_id || region,
                        country_id,
                        postcode,
                        telephone
                    }
                });
                refetch();
                setOpenEditModal(false);
            } catch (error) {
                addToast({
                    type: 'error',
                    icon: errorIcon,
                    message: String(error),
                    dismissable: true,
                    timeout: 7000
                });
            }
        },
        [refetch, setOpenEditModal, addToast, setUpdateCompayInfo]
    );
    const submitCreateCompanyAccount = useCallback(
        async formValues => {
            try {
                await setRegisterCompany({
                    variables: {
                        ...formValues
                    }
                });
                setCreateModal(false);
                refetch();
                addToast({
                    type: 'success',
                    message: formatMessage({
                        id: 'companyAccount.added',
                        defaultMessage: 'Your request has been received'
                    }),
                    timeout: 7000
                });
                setTimeout(() => {
                    history.push('/company-account/informations');
                }, 2000);
            } catch (error) {
                addToast({
                    type: 'error',
                    icon: errorIcon,
                    message: String(error),
                    dismissable: true,
                    timeout: 7000
                });
            }
        },
        [refetch, setCreateModal, setRegisterCompany]
    );

    return {
        companyInfo,
        loading: UpdatecompanyLoading || companyInfoLoading,
        submitEdit,
        handleEditbtn,
        openEditModal,
        handelCancelModal,
        formProps,
        editType,
        setCreateModal,
        createModal,
        formCreateModal,
        submitCreateCompanyAccount
    };
};
