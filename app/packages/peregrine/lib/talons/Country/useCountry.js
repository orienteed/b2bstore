import { useAdapter } from '../../hooks/useAdapter';

export const useCountry = () => {
    const { getCountries } = useAdapter();
    const { data, loading, error } = getCountries();

    let formattedCountriesData = [{ label: 'Loading Countries...', value: '' }];
    if (!loading && !error) {
        const { countries } = data;
        formattedCountriesData = countries.map(country => ({
            // If a country is missing the full english name just show the abbreviation.
            label: country.full_name_english || country.two_letter_abbreviation,
            value: country.two_letter_abbreviation
        }));
        formattedCountriesData.sort((a, b) => (a.label < b.label ? -1 : 1));
    }

    return {
        countries: formattedCountriesData,
        loading
    };
};
