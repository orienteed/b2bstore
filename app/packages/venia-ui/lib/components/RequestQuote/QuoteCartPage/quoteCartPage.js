import { getConfigData, getQuoteId } from '@magento/peregrine/lib/talons/RequestQuote/Store';
import { useQuoteCartPage } from '@magento/peregrine/lib/talons/RequestQuote/useQuoteCartPage';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import AddProductBySku from './AddProductBySku';
import defaultClasses from './quoteCartPage.module.css';
import QuotePriceSummary from './QuotePriceSummary';
import QuoteProductListing from './QuoteProductListing';

const QuoteCartPage = props => {
	const { loading, myQuote, setActiveEditItem, setIsCartUpdating, handleDeleteQuote, handleSubmitQuoteBtn } =
		useQuoteCartPage({
			getConfigData,
			getQuoteId
		});

	const classes = useStyle(defaultClasses, props.classes);
	const { formatMessage } = useIntl();

	if (loading) {
		return <LoadingIndicator />;
	}

	let hasItems = false;
	if (Object.keys(myQuote).length && Object.keys(myQuote.items).length) {
		hasItems = true;
	}

	const quoteProductListing = hasItems ? (
		<QuoteProductListing
			items={myQuote.items}
			setActiveEditItem={setActiveEditItem}
			setIsCartUpdating={setIsCartUpdating}
			handleDeleteQuote={handleDeleteQuote}
		/>
	) : (
		<h3>
			<FormattedMessage id={'quoteCartPage.emptyCart'} defaultMessage={'You have no items in your quote cart.'} />
		</h3>
	);

	const quotePriceSummary = hasItems ? (
		<QuotePriceSummary handleSubmitQuoteBtn={handleSubmitQuoteBtn} quote={myQuote} />
	) : null;

	return (
		<div className={classes.root}>
			<StoreTitle>
				{formatMessage({
					id: 'quoteCartPage.title',
					defaultMessage: 'My Quote Cart'
				})}
			</StoreTitle>
			<div className={classes.heading_container}>
				<h1 className={classes.heading}>
					<FormattedMessage id={'quoteCartPage.heading'} defaultMessage={'My Quote Cart'} />
				</h1>
			</div>
			<div className={classes.body}>
				<div className={classes.addProductBySku_container}>
					<AddProductBySku />
				</div>
				<div className={classes.items_container}>{quoteProductListing}</div>

				<div className={classes.summary_container}>
					<div className={classes.summary_contents}>{quotePriceSummary}</div>
				</div>
			</div>
		</div>
	);
};

export default QuoteCartPage;

QuoteCartPage.propTypes = {
	classes: shape({
		root: string,
		heading_container: string,
		heading: string,
		body: string,
		items_container: string,
		price_adjustments_container: string,
		summary_container: string,
		summary_contents: string
	})
};
