import React, { Fragment } from 'react';
import { shape, string } from 'prop-types';

import CMSPageShimmer from '@magento/venia-ui/lib/RootComponents/CMS/cms.shimmer';
import { useCmsPage } from '@magento/peregrine/lib/talons/Cms/useCmsPage';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { toCamelCase } from '@magento/venia-ui/lib/util/toCamelCase';

import defaultClasses from './cms.module.css';

import HomeNav from '@orienteed/customComponents/components/HomeNav';
import { Meta, StoreTitle } from '@magento/venia-ui/lib/components/Head';
import RichContent from '@magento/venia-ui/lib/components/RichContent';

const CMSPage = props => {
    const { identifier } = props;

    const talonProps = useCmsPage({ identifier });
    const { cmsPage, shouldShowLoadingIndicator, products } = talonProps;
    const classes = useStyle(defaultClasses, props.classes);

    if (shouldShowLoadingIndicator) {
        return <CMSPageShimmer classes={classes} />;
    }

    const { content_heading, title, meta_title, meta_description, page_layout, content } = cmsPage;

    const pageTitle = meta_title || title;
    const rootClassName = page_layout ? classes[`root_${toCamelCase(page_layout)}`] : classes.root;
    return (
        <Fragment>
            <HomeNav />
            <div className={classes.container}>
                <Meta name="title" content={pageTitle} />
                <Meta name="description" content={meta_description} />
                <article className={rootClassName}>
                    <RichContent html={content} />
                </article>
            </div>
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
