import { useQuotes } from '@magento/peregrine/lib/talons/RequestQuote/useQuotes';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { shape, string } from 'prop-types';
import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import defaultClasses from './quotes.module.css';
import QuotesRow from './quotesRow';
import QuotesToolbar from './quotesToolbar';

const Quotes = props => {
	const talonProps = useQuotes();

	const {
		pageSize,
		quotes,
		isLoading,
		currentPage,
		totalPage,
		handlePageSize,
		handleCurrentPage,
		handleDeleteQuote,
		handleCancelQuote,
		handleDuplicateQuote,
		handleQuoteToCart
	} = talonProps;

	const { formatMessage } = useIntl();

	const PAGE_TITLE = formatMessage({
		id: 'quotesPage.pageTitleText',
		defaultMessage: 'My Quotes'
	});

	const classes = useStyle(defaultClasses, props.classes);

	const quotesTableRow = useMemo(() => {
		if (quotes.length > 0) {
			return quotes.map(quote => {
				return (
					<QuotesRow
						key={quote.entity_id}
						quote={quote}
						handleDeleteQuote={() => {
							handleDeleteQuote(quote.entity_id);
						}}
						handleCancelQuote={() => {
							handleCancelQuote(quote.entity_id);
						}}
						handleDuplicateQuote={() => {
							handleDuplicateQuote(quote.entity_id);
						}}
						handleQuoteToCart={() => {
							handleQuoteToCart(quote.entity_id);
						}}
					/>
				);
			});
		} else {
			return (
				<h3 className={classes.emptyHistoryMessage}>
					<FormattedMessage
						id={'quotesPage.emptyDataMessage'}
						defaultMessage={"You don't have any quote yet."}
					/>
				</h3>
			);
		}
	}, [quotes]);

	if (isLoading) {
		return fullPageLoadingIndicator;
	}

	return (
		<div className={classes.root}>
			<StoreTitle>{PAGE_TITLE}</StoreTitle>
			<h1 className={classes.heading}>{PAGE_TITLE}</h1>
			<div className={classes.content}>
				<div className={classes.quotesTableSection}>
					<ul className={classes.quotesTable}>{quotesTableRow}</ul>
				</div>
				<QuotesToolbar
					pageSize={pageSize}
					currentPage={currentPage}
					totalPage={totalPage}
					handlePageSize={handlePageSize}
					handleCurrentPage={handleCurrentPage}
				/>
			</div>
		</div>
	);
};

export default Quotes;

Quotes.propTypes = {
	classes: shape({
		root: string,
		heading: string,
		content: string,
		quotesTableSection: string,
		quotesTable: string
	})
};
