/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-no-literals */
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Table from '../Table/Table';
import copyToClipboard from './icons/copyToClipboard.png';
import { useStyle } from '../../../classify';
import defaultClasses from './ProductDetailsTable.module.css';

const ProductDetailsTable = props => {
    const { item } = props;
    const classes = useStyle(defaultClasses);

    const { formatMessage } = useIntl();

    const tableHeader = [
        <FormattedMessage id={'rmaPage.productName'} defaultMessage={'Product Name'} />,
        <FormattedMessage id={'rmaPage.sku'} defaultMessage={'SKU'} />,
        <FormattedMessage id={'rmaPage.price'} defaultMessage={'Price'} />,
        <FormattedMessage id={'rmaPage.reason'} defaultMessage={'Reason'} />,
        <FormattedMessage id={'rmaPage.solution'} defaultMessage={'Solution'} />,
        <FormattedMessage id={'rmaPage.additionalField'} defaultMessage={'Additional Field'} />,
        <FormattedMessage id={'rmaPage.qty'} defaultMessage={'Qty'} />
    ];

    const [copied, setCopied] = useState(false);

    const copyText = () => {
        navigator.clipboard.writeText(simpleProductData.sku);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    const tableRows = item?.request_item.map(req => {
        const productSku = (
            <div className={classes.indexMobileSku}>
                {' '}
                {copied ? (
                    <div className={classes.copiedText}>
                        <FormattedMessage id={'productFullDetailB2B.copiedText'} defaultMessage={'Copied'} />
                    </div>
                ) : (
                    <div className={classes.productSkuContainer}>
                        <span onClick={copyText}>{`..${req.sku.substring(req.sku.length - 5)}`}</span>
                        <img src={copyToClipboard} alt="copyToClipboard" onClick={copyText} />
                    </div>
                )}
            </div>
        );
        return [
            {
                dataLable: formatMessage({
                    id: 'rmaPage.productName',
                    defaultMessage: 'Product Name'
                }),
                value: req.name
            },
            {
                dataLable: formatMessage({
                    id: 'rmaPage.sku',
                    defaultMessage: 'SKU'
                }),
                value: productSku
            },
            {
                dataLable: formatMessage({
                    id: 'rmaPage.price',
                    defaultMessage: 'Price'
                }),
                value: `${req.price} ${req.currency}`
            },
            {
                dataLable: formatMessage({
                    id: 'rmaPage.reason',
                    defaultMessage: 'Reason'
                }),
                value: req.reason
            },
            {
                dataLable: formatMessage({
                    id: 'rmaPage.solution',
                    defaultMessage: 'Solution'
                }),
                value: req.solution
            },
            {
                dataLable: formatMessage({
                    id: 'rmaPage.additionalField',
                    defaultMessage: 'Additional Field'
                }),
                value: (
                    <>
                        {JSON.parse(req.additional_fields).map(field => (
                            <>
                                <span>{field.label + ': '}</span>
                                <span>{field.content}</span>
                                <br />
                            </>
                        ))}
                    </>
                )
            },
            {
                dataLable: formatMessage({
                    id: 'rmaPage.qty',
                    defaultMessage: 'Qty'
                }),
                value: req.qty_rma
            }
        ];
    });
    return (
        <div className={classes.tableContainer}>
            <Table headers={tableHeader} tableRows={tableRows} />
        </div>
    );
};

export default ProductDetailsTable;
