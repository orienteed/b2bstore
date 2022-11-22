import React, { useCallback, useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from '../graphql/company.gql';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useToasts } from '@magento/peregrine';
import { AlertCircle as AlertCircleIcon } from 'react-feather';
import Icon from '@magento/venia-ui/lib/components/Icon';

const errorIcon = <Icon src={AlertCircleIcon} size={20} />;
export const useCompanyAccountInfo = props => {
    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editType, setEditType] = useState();
    const { registerCompany, companyData, updateCompayInfo } = operations;
    const [{ cartId }] = useCartContext();
    const [, { addToast }] = useToasts();

    const { data: companyInfo, loading: companyInfoLoading, refetch } = useQuery(companyData, {
        fetchPolicy: 'no-cache'

    });
    const [formAddress, setFormAddress] = useState();
    const formProps = {
        initialValues: formAddress
    };
    const [setRegisterCompany, { loading, data: setCompanyData }] = useMutation(registerCompany);

    const [setUpdateCompayInfo, { data: CompanyDataUpdated, error: updateDataError }] = useMutation(updateCompayInfo);

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

    const submitEdit = useCallback(async formValues => {
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
            console.log(formValues,'formValues');
            await setUpdateCompayInfo({
                variables: {
                    name,
                    legal_name,
                    email,
                    vat_id,
                    reseller_id,
                    street,
                    city,
                    region_id:region_id||region,
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
    }, []);

    const createCompanyAccount = async data => {
        const { city, country_id, email, name, street, postcode, telephone } = data;
        await setRegisterCompany({
            variables: {
                email,
                name,
                street,
                city,
                country_id,
                postcode,
                telephone
            }
        });
    };

    return {
        createCompanyAccount,
        companyInfo,
        companyInfoLoading,
        submitEdit,
        handleEditbtn,
        openEditModal,
        handelCancelModal,
        formProps,
        editType
    };
};
