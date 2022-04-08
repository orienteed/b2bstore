import React from 'react';
import CustomButton from './CustomButton/customButton';
import { FormattedMessage } from 'react-intl';
import { useDownloadCsv } from '../../talons/DownloadCsv/useDownloadCsv';
import { useDownloadCsvContext } from '../DownloadCsvProvider/downloadCsvProvider';

import defaultClasses from './downloadCsv.module.css';
import { CSVLink } from 'react-csv';

import ProductSort from './ProductSort/productSort';

import { useSortCatalog } from '../../talons/DownloadCsv/useSortCatalog';

const DownloadCsv = () => {
    const { galleryItem, currentCatalog } = useDownloadCsvContext();

    const talonProps = useDownloadCsv();
    const { catalogRegularPrice, catalogDiscountPrice } = talonProps;

    const sortProps1 = useSortCatalog();

    let newCatalogRegularPrice;
    let newCatalogDiscountPrice;
    let newGalleryItemRegularPrice;
    let newGalleryItemDiscountPrice;

    let donwloadButton;

    if (galleryItem) {
        newGalleryItemRegularPrice = galleryItem.map(item => {
            return {
                categorie: item.categories[0].name,
                description: item.description.html,
                name: item.name,
                price: item.price.regularPrice.amount.value,
                sku: item.sku
            };
        });
    }

    if (galleryItem) {
        newGalleryItemDiscountPrice = galleryItem.map(item => {
            return {
                categorie: item.categories[0].name,
                description: item.description.html,
                name: item.name,
                price: item.price.minimalPrice.amount.value,
                sku: item.sku
            };
        });
    }

    if (catalogRegularPrice) {
        newCatalogRegularPrice = catalogRegularPrice.products.items.map(
            product =>
                product.variants.map(variant => {
                    return {
                        categorie: variant.product.categories[0].name,
                        description: variant.product.description.html,
                        name: variant.product.name,
                        price: variant.product.price.regularPrice.amount.value,
                        sku: variant.product.sku
                    };
                })
        );
    } else {
        return null;
    }

    if (catalogDiscountPrice) {
        newCatalogDiscountPrice = catalogDiscountPrice.products.items.map(
            product =>
                product.variants.map(variant => {
                    return {
                        categorie: variant.product.categories[0].name,
                        description: variant.product.description.html,
                        name: variant.product.name,
                        price: variant.product.price.minimalPrice.amount.value,
                        sku: variant.product.sku
                    };
                })
        );
    } else {
        return null;
    }

    const flatNewCatalogRegularPrice = newCatalogRegularPrice.flat();
    const flatNewCatalogDiscountPrice = newCatalogDiscountPrice.flat();

    if (currentCatalog === 'fullCatalogPvP') {
        donwloadButton = (
            <CustomButton priority={'high'}>
                <CSVLink data={flatNewCatalogRegularPrice}>
                    <FormattedMessage
                        id={'download'}
                        defaultMessage={'download'}
                    />
                </CSVLink>
            </CustomButton>
        );
    } else if (currentCatalog === 'fullCatalogPersonal') {
        donwloadButton = (
            <CustomButton priority={'high'}>
                <CSVLink data={flatNewCatalogDiscountPrice}>
                    <FormattedMessage
                        id={'download'}
                        defaultMessage={'download'}
                    />
                </CSVLink>
            </CustomButton>
        );
    } else if (currentCatalog === 'thisCatalogPvP') {
        donwloadButton = (
            <CustomButton priority={'high'}>
                <CSVLink data={newGalleryItemRegularPrice}>
                    <FormattedMessage
                        id={'download'}
                        defaultMessage={'download'}
                    />
                </CSVLink>
            </CustomButton>
        );
    } else {
        donwloadButton = (
            <CustomButton priority={'high'}>
                <CSVLink data={newGalleryItemDiscountPrice}>
                    <FormattedMessage
                        id={'download'}
                        defaultMessage={'download'}
                    />
                </CSVLink>
            </CustomButton>
        );
    }

    return (
        <main className={defaultClasses.buttonContainer}>
            <article>{donwloadButton}</article>
            <section className={defaultClasses.sortContainer}>
                <ProductSort sortProps1={sortProps1} />
            </section>
        </main>
    );
};

export default DownloadCsv;
