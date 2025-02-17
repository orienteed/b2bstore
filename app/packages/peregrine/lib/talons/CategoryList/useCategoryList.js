/* Deprecated in PWA-12.1.0*/

import { useStoreConfigContext } from '../../context/storeConfigProvider';
import { useAdapter } from '../../hooks/useAdapter';

/**
 * Returns props necessary to render a CategoryList component.
 *
 * @param {object} props
 * @param {object} props.query - category data
 * @param {string} props.id - category id
 * @return {{ childCategories: array, error: object }}
 */
export const useCategoryList = props => {
    const { id } = props;

    const { getCategoryData } = useAdapter();
    const { data, loading, error } = getCategoryData({ id });

    const { data: storeConfigData } = useStoreConfigContext();
    const storeConfig = storeConfigData ? storeConfigData.storeConfig : null;

    return {
        childCategories: (data && data.categories.items[0] && data.categories.items[0].children) || null,
        storeConfig,
        error,
        loading
    };
};
