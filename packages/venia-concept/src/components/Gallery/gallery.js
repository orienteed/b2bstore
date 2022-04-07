import React, { useMemo, useEffect } from 'react';
import { string, shape, array } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';
import GalleryItem from '@magento/venia-ui/lib/components/Gallery/item';
import GalleryItemShimmer from '@magento/venia-ui/lib/components/Gallery/item.shimmer';
import defaultClasses from '@magento/venia-ui/lib/components/Gallery/gallery.module.css';
import { useGallery } from '@magento/peregrine/lib/talons/Gallery/useGallery';
import { useDownloadCsvContext } from '@orienteed/customComponents/components/DownloadCsvProvider/downloadCsvProvider';

const mapGalleryItem = item => {
    const { small_image } = item;
    return {
        ...item,
        small_image:
            typeof small_image === 'object' ? small_image.url : small_image
    };
};

/**
 * Renders a Gallery of items. If items is an array of nulls Gallery will render
 * a placeholder item for each.
 *
 * @params {Array} props.items an array of items to render
 */
const Gallery = props => {
    const { items } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { setGalleryItem } = useDownloadCsvContext();
    const talonProps = useGallery();
    const { storeConfig } = talonProps;

    useEffect(() => {
        setGalleryItem(items);
    }, [items]);

    const galleryItems = useMemo(
        () =>
            items.map((item, index) => {
                if (item === null) {
                    return <GalleryItemShimmer key={index} />;
                }
                return (
                    <GalleryItem
                        key={item.id}
                        item={mapGalleryItem(item)}
                        storeConfig={storeConfig}
                    />
                );
            }),
        [items, storeConfig]
    );

    return (
        <div className={classes.root} aria-live="polite" aria-busy="false">
            <div className={classes.items}>{galleryItems}</div>
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
