import React, { useMemo, useEffect } from 'react';
import { string, shape, array } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';
import GalleryItem from '@magento/venia-ui/lib/components/Gallery/item';
import GalleryItemShimmer from '@magento/venia-ui/lib/components/Gallery/item.shimmer';
import defaultClasses from '@magento/venia-ui/lib/components/Gallery/gallery.module.css';
import { useGallery } from '@magento/peregrine/lib/talons/Gallery/useGallery';
import { useDownloadCsvContext } from '@orienteed/customComponents/components/DownloadCsvProvider/downloadCsvProvider';
import RecommendedProducts from '@orienteed/customComponents/components/RecommendedProducts';

/**
 * Renders a Gallery of items. If items is an array of nulls Gallery will render
 * a placeholder item for each.
 *
 * @params {Array} props.items an array of items to render
 */
const Gallery = props => {
    const { items, homePage } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = useGallery();
    const { storeConfig } = talonProps;
    const { setGalleryItem } = useDownloadCsvContext();

    useEffect(() => {
        setGalleryItem(items);
    }, [items]);
    const galleryItems = useMemo(() => {
        if (homePage) {
            return <RecommendedProducts products={items} />;
        } else {
            items.map((item, index) => {
                if (item === null) {
                    return <GalleryItemShimmer key={index} />;
                }
                return <GalleryItem key={item.id} item={item} storeConfig={storeConfig} />;
            });
        }
    }, [items, storeConfig]);

    return (
        <div data-cy="Gallery-root" className={classes.root} aria-live="polite" aria-busy="false">
            <div className={!homePage && classes.items}>{galleryItems}</div>
        </div>
    );
};

Gallery.propTypes = {
    classes: shape({
        filters: string,
        items: string,
        pagination: string,
        root: string
    }),
    items: array.isRequired
};

export default Gallery;
