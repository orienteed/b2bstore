import Button from '@magento/venia-ui/lib/components/Button';
import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Dialog from '../../Dialog';
import TextArea from '../../TextArea';
import { usePrintPdfContext } from '../PrintPdfProvider/printPdfProvider';
import Dropzone from './Dropzone';
import ImagesList from './imagesList';
import ItemCard from './itemCard';
import ItemSummaryCard from './itemSummaryCard';
import defaultClasses from './printPdfPopup.module.css';
const PrintPdfPopup = React.forwardRef((props, ref) => {
	const { openPopup, handleClosePopup, handlePrint } = props;
	const { priceSummary, cartItem } = usePrintPdfContext();
	const [tooglePrice, setTooglePrice] = useState(false);
	const [companyInfo, setCompanyInfo] = useState();

	const { formatMessage } = useIntl();

	const productTitle = <FormattedMessage id={'productTitle'} defaultMessage={'Products'} />;
	const descriptionTitle = <FormattedMessage id={'descriptionTitle'} defaultMessage={'Description'} />;
	const pricesTitle = <FormattedMessage id={'pricesTitle'} defaultMessage={'Prices'} />;
	const companyInfoPlaceholder = formatMessage({ id: 'companyInfo', defaultMessage: 'Company Info' });

	const handleTooglePrice = () => {
		setTooglePrice(!tooglePrice);
	};

	const editPriceButton = (
		<Button priority={'high'} onClick={handleTooglePrice}>
			<FormattedMessage id={'editPdfButton'} defaultMessage={'Edit'} />
		</Button>
	);

	const printButton = (
		<Button priority={'high'} onClick={handlePrint}>
			<FormattedMessage id={'printTitle'} defaultMessage={'Print'} />
		</Button>
	);

	const doneButton = (
		<Button priority={'high'} onClick={handleTooglePrice}>
			<FormattedMessage id={'donePdfButton'} defaultMessage={'Done'} />
		</Button>
	);

	const printTitle = <FormattedMessage id={'printTitle'} defaultMessage={'Print'} />;

	const dialogButtonsArray = [tooglePrice ? doneButton : editPriceButton, printButton];

	return (
		<Dialog
			title={printTitle}
			isOpen={openPopup}
			shouldUseButtonsArray={true}
			buttonsArray={dialogButtonsArray}
			onCancel={handleClosePopup}
		>
			<Dropzone />
			<main ref={ref}>
				<article className={defaultClasses.imagesContainer}>
					<ImagesList />
				</article>
				<section className={defaultClasses.companyData}>
					<TextArea
						id="info"
						field="info"
						placeholder={companyInfoPlaceholder + '...'}
						value={companyInfo}
						maxLength={10000}
						onChange={e => setCompanyInfo(e.target.value)}
					/>
					<article className={defaultClasses.emptyContainer}>
						<article />
					</article>
				</section>
				<section className={defaultClasses.titlesContainer}>
					<article className={defaultClasses.titleProduct}>
						<p>{productTitle}</p>
					</article>
					<article className={defaultClasses.titleDescription}>
						<p>{descriptionTitle}</p>
					</article>
					<article className={defaultClasses.titlePrice}>
						<p>{pricesTitle}</p>
					</article>
				</section>

				{cartItem && (
					<div className={defaultClasses.cartItemContainer}>
						{cartItem.map(item => {
							return <ItemCard key={item.id} item={item} tooglePrice={tooglePrice} />;
						})}
					</div>
				)}
				{priceSummary ? (
					<ItemSummaryCard
						tooglePrice={tooglePrice}
						priceSummary={priceSummary}
						editPriceButton={editPriceButton}
					/>
				) : null}
			</main>
		</Dialog>
	);
});

export default PrintPdfPopup;
