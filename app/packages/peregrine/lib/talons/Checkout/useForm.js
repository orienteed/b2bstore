import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

export const useForm = props => {
    const { getCountries } = useAdapter();

    const { loading: isLoadingCountries, error: countriesError, data: countriesData } = getCountries()
    const { countries } = countriesData || {};

    return {
        countries,
        hasError: !!countriesError,
        isLoading: !!isLoadingCountries
    };
};
