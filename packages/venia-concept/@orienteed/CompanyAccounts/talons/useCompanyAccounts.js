import { useCallback, useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from '../graphql/company.gql';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const useCompanyAccount = props => {
    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const [companyDataSt, setCompanyDataSt] = useState();
    const { registerCompany, companyData, getCompanyUsers, updateCompayInfo } = operations;

    const [{ cartId }] = useCartContext();

    const { data: companyInfo, error } = useQuery(companyData, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    const { data: companyUsers } = useQuery(getCompanyUsers, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    console.log(companyInfo, 'companyInfo', companyUsers);
    const [setRegisterCompany, { loading, data: setCompanyData }] = useMutation(registerCompany);

    const [setUpdateCompayInfo, { data: CompanyDataUpdated }] = useMutation(updateCompayInfo);

    useEffect(() => {
        if (companyInfo) {
            const { mpCompanyAccounts } = companyInfo;
            setCompanyDataSt({ ...mpCompanyAccounts });
        }
    }, [companyInfo]);

    const updateComponyInfo = useCallback(async () => {
        await setUpdateCompayInfo({
            variables: {
                ...companyDataSt
            }
        });
    }, [companyDataSt]);

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
        updateComponyInfo
    };
};
