import { useEffect, useMemo } from 'react';

import { useStoreConfigContext } from '../../context/storeConfigProvider';
import { useAdapter } from '../../hooks/useAdapter';

/**
 * @typedef {object} CategoryNode
 * @prop {object} category - category data
 * @prop {boolean} isLeaf - true if the category has no children
 */

/**
 * @typedef { import("graphql").DocumentNode } DocumentNode
 */

/**
 * Returns props necessary to render a CategoryTree component.
 *
 * @param {object} props
 * @param {number} props.categoryId - category id for this node
 * @param {DocumentNode} props.query - GraphQL query
 * @param {function} props.updateCategories - bound action creator
 * @return {{ childCategories: Map<number, CategoryNode> }}
 */
export const useCategoryTree = props => {
    const { categoryId, updateCategories } = props;

    const { getCategoryData } = useAdapter();
    const { runQuery, data } = getCategoryData({ type: 'request' });

    const { data: storeConfigData } = useStoreConfigContext();
    const categoryUrlSuffix = storeConfigData?.storeConfig?.category_url_suffix;

    // fetch categories
    useEffect(() => {
        if (categoryId != null) {
            runQuery({ variables: { id: categoryId } });
        }
    }, [categoryId, runQuery]);

    // update redux with fetched categories
    useEffect(() => {
        if (data && data.categories.items[0]) {
            updateCategories(data.categories.items[0]);
        }
    }, [data, updateCategories]);

    const rootCategory = data && data.categories.items[0];

    const { children = [] } = rootCategory || {};

    const childCategories = useMemo(() => {
        const childCategories = new Map();

        // Add the root category when appropriate.
        if (rootCategory && rootCategory.include_in_menu && rootCategory.url_path) {
            childCategories.set(rootCategory.uid, {
                category: rootCategory,
                isLeaf: true
            });
        }

        children.map(category => {
            if (category.include_in_menu) {
                const isLeaf = !parseInt(category.children_count);
                childCategories.set(category.uid, { category, isLeaf });
            }
        });

        return childCategories;
    }, [children, rootCategory]);

    return { childCategories, data, categoryUrlSuffix };
};
