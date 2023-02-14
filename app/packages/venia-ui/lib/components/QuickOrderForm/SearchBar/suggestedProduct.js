import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import Price from '@magento/venia-ui/lib/components/Price';
import { func, number, shape, string } from 'prop-types';
import React, { useCallback } from 'react';

import defaultClasses from './suggestedProduct.module.css';

const IMAGE_WIDTH = 60;

const SuggestedProduct = props => {
	const classes = useStyle(defaultClasses, props.classes);
	const { small_image, name, onNavigate, price } = props;

	const handleClick = useCallback(() => {
		if (typeof onNavigate === 'function') {
			onNavigate(props);
		}
	}, [onNavigate, props]);

	return (
		<>
			<div
				className={classes.root}
				onClick={handleClick}
				data-cy="SuggestedProduct-root"
				role="button"
				tabIndex={0}
			>
				<Image
					alt={name}
					classes={{
						image: classes.thumbnail,
						root: classes.image
					}}
					resource={small_image}
					width={IMAGE_WIDTH}
					data-cy="SuggestedProduct-image"
				/>
				<span className={classes.name}>{name}</span>
				<span data-cy="SuggestedProduct-price" className={classes.price}>
					<Price currencyCode={price.minimalPrice.amount.currency} value={price.minimalPrice.amount.value} />
				</span>
			</div>
		</>
	);
};

SuggestedProduct.propTypes = {
	url_key: string.isRequired,
	small_image: string.isRequired,
	name: string.isRequired,
	onNavigate: func,
	price: shape({
		regularPrice: shape({
			amount: shape({
				currency: string,
				value: number
			})
		}),
		minimalPrice: shape({
			amount: shape({
				currency: string,
				value: number
			})
		})
	}).isRequired,
	classes: shape({
		root: string,
		image: string,
		name: string,
		price: string,
		thumbnail: string
	})
};

export default SuggestedProduct;
