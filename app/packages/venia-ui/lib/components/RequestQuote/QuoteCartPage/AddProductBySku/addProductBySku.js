import { useAddProductBySku } from '@magento/peregrine/lib/talons/RequestQuote/QuotePage/useAddProductBySku';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import Field from '@magento/venia-ui/lib/components/Field';
import Image from '@magento/venia-ui/lib/components/Image';
import Price from '@magento/venia-ui/lib/components/Price';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { Form } from 'informed';
import { shape, string } from 'prop-types';
import React, { Fragment, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import defaultClasses from './addProductBySku.module.css';

const IMAGE_WIDTH = 60;

const AddProductBySku = props => {
	const { products, isFatching, handleAddItemBySku, handleSearchData } = useAddProductBySku();

	const classes = useStyle(defaultClasses, props.classes);
	const { formatMessage } = useIntl();

	const formClass = classes.entryForm;

	const fatchingComponents = useMemo(() => {
		if (isFatching) {
			return (
				<div className={classes.message}>
					<FormattedMessage id={'addProductBySku.add'} defaultMessage={'Fetching Details...'} />
				</div>
			);
		} else {
			return null;
		}
	});

	const productComponents = useMemo(() => {
		if (products) {
			return products.map(product => (
				<Form className={formClass} onSubmit={() => handleAddItemBySku(product.sku)} key={product.sku}>
					<div className={classes.productLeft}>
						<Link
							className={classes.thumbnailContainer}
							to={resourceUrl('/' + product.url_key + product.url_suffix)}
						>
							<Image
								alt={product.name}
								classes={{ image: classes.thumbnail, root: classes.image }}
								resource={product.small_image.url}
								width={IMAGE_WIDTH}
							/>
						</Link>
						<div className={classes.productNameCol}>
							<span className={classes.name}>{product.name}</span>
							<span className={classes.price}>
								<Price
									currencyCode={product.price.regularPrice.amount.currency}
									value={product.price.regularPrice.amount.value}
								/>
							</span>
						</div>
					</div>
					{product.type_id == 'simple' && (
						<Field>
							<Button disabled={false} priority={'normal'} type={'submit'}>
								<FormattedMessage id={'addProductBySku.add'} defaultMessage={'Add'} />
							</Button>
						</Field>
					)}
				</Form>
			));
		}
	}, [products]);

	return (
		<div className={classes.root}>
			<Field
				id="mrfq-sku-input"
				label={formatMessage({
					id: 'addProductBySku.addProductBySkuText',
					defaultMessage: 'Search Product'
				})}
			>
				<TextInput onKeyUp={handleSearchData} field="searchProduct" id={'searchProduct'} />
			</Field>
			<div className={classes.dropdownProductCol}>
				{fatchingComponents}
				{products.length > 0 && (
					<div className={classes.dropdownProduct}>
						<Fragment>{productComponents}</Fragment>
					</div>
				)}
			</div>
		</div>
	);
};

export default AddProductBySku;

AddProductBySku.propTypes = {
	classes: shape({
		root: string
	})
};
