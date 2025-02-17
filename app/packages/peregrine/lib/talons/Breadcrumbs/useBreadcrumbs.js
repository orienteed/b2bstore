import { useMemo } from 'react';
import useInternalLink from '../../hooks/useInternalLink';
import { useStoreConfigContext } from '../../context/storeConfigProvider';
import { useAdapter } from '../../hooks/useAdapter';

// Just incase the data is unsorted, lets sort it.
const sortCrumbs = (a, b) => a.category_level > b.category_level;

// Generates the path for the category.
const getPath = (path, suffix) => {
    if (path) {
        return `/${path}${suffix || ''}`;
    }

    // If there is no path this is just a dead link.
    return '#';
};

/**
 * Returns props necessary to render a Breadcrumbs component.
 *
 * @param {object} props
 * @param {object} props.query - the breadcrumb query
 * @param {string} props.categoryId - the id of the category for which to generate breadcrumbs
 * @return {{
 *   currentCategory: string,
 *   currentCategoryPath: string,
 *   isLoading: boolean,
 *   normalizedData: array,
 *   handleClick: function
 * }}
 */
export const useBreadcrumbs = props => {
    const { categoryId } = props;

    const { getBreadcrumbs } = useAdapter();
    const { data, loading, error } = getBreadcrumbs({ category_id: categoryId });

    const { data: storeConfigData } = useStoreConfigContext();

    const categoryUrlSuffix = useMemo(() => {
        if (storeConfigData) {
            return storeConfigData.storeConfig.category_url_suffix;
        }
    }, [storeConfigData]);

    // When we have breadcrumb data sort and normalize it for easy rendering.
    const normalizedData = useMemo(() => {
        if (!loading && data && data.categories.items.length) {
            const breadcrumbData = data.categories.items[0].breadcrumbs;

            return (
                breadcrumbData &&
                breadcrumbData
                    .map(category => ({
                        category_level: category.category_level,
                        text: category.category_name,
                        path: getPath(category.category_url_path, categoryUrlSuffix)
                    }))
                    .sort(sortCrumbs)
            );
        }
    }, [categoryUrlSuffix, data, loading]);

    const { setShimmerType } = useInternalLink('category');

    return {
        currentCategory: (data && data.categories.items.length && data.categories.items[0].name) || '',
        currentCategoryPath:
            (data &&
                data.categories.items.length &&
                `${data.categories.items[0].url_path}${categoryUrlSuffix || ''}`) ||
            '#',
        isLoading: loading,
        hasError: !!error,
        normalizedData: normalizedData || [],
        handleClick: setShimmerType
    };
};
