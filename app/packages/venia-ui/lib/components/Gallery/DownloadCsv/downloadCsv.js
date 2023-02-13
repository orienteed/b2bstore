import { useDownloadCsvContext } from '@magento/venia-ui/lib/components/Gallery/DownloadCsvProvider/downloadCsvProvider.js';
import React from 'react';
import { CSVLink } from 'react-csv';
import { FormattedMessage } from 'react-intl';

import Button from '../../Button';
import defaultClasses from './downloadCsv.module.css';

const DownloadCsv = () => {
	const { galleryItem } = useDownloadCsvContext();

	let newGalleryItemRegularPrice;

	if (galleryItem.length > 0) {
		newGalleryItemRegularPrice = galleryItem.map(item => {
			if (item.__typename === 'ConfigurableProduct' && item.variants) {
				return item.variants.map(variant => {
					return {
						description: variant.product.description.html,
						name: variant.product.name,
						regularPrice: variant.product.price.regularPrice.amount.value,
						discountPrice: variant.product.price.minimalPrice.amount.value,
						sku: variant.product.sku
					};
				});
			} else {
				return {
					description: 'not defined',
					name: 'not defined',
					price: 'not defined',
					sku: 'not defined'
				};
			}
		});
	} else {
		return null;
	}

	const flatNewGalleryItem = newGalleryItemRegularPrice.flat();

	const donwloadButton = (
		<CSVLink filename="Downloaded-catalog.csv" data={flatNewGalleryItem}>
			<Button className={defaultClasses.downloadButton}>
				<FormattedMessage id={'download'} defaultMessage={'download'} />
			</Button>
		</CSVLink>
	);

	return (
		<div className={defaultClasses.buttonContainer}>
			<div className={defaultClasses.donwloadButton}>{donwloadButton}</div>
		</div>
	);
};

export default DownloadCsv;
