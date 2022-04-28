import React, { Fragment } from 'react';
import { shape, string } from 'prop-types';

import CMSPageShimmer from '@magento/venia-ui/lib/RootComponents/CMS/cms.shimmer';
import { useCmsPage } from '@magento/peregrine/lib/talons/Cms/useCmsPage';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { toCamelCase } from '@magento/venia-ui/lib/util/toCamelCase';

import defaultClasses from '@magento/venia-ui/lib/RootComponents/CMS/cms.module.css';

import RecommendedProducts from '@orienteed/customComponents/components/RecommendedProducts';
import HomeNav from '@orienteed/customComponents/components/HomeNav';

const CMSPage = props => {
    const { identifier } = props;

    const talonProps = useCmsPage({ identifier });
    const { cmsPage, shouldShowLoadingIndicator } = talonProps;
    const classes = useStyle(defaultClasses, props.classes);

    if (shouldShowLoadingIndicator) {
        return <CMSPageShimmer classes={classes} />;
    }

    const { content_heading, title, meta_title, meta_description, page_layout, content } = cmsPage;

    return (
        <Fragment>
            <HomeNav />
            <RecommendedProducts />
        </Fragment>
    );
};

CMSPage.propTypes = {
    identifier: string,
    classes: shape({
        root: string,
        heading: string,
        root_empty: string,
        root_1column: string,
        root_2columnsLeft: string,
        root_2columnsRight: string,
        root_3columns: string,
        root_cmsFullWidth: string,
        root_categoryFullWidth: string,
        root_productFullWidth: string
    })
};

export default CMSPage;
