import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Table from '../Table/Table';

const ProductDetailsTable = props => {
    const { item } = props;
    console.log(item?.request_item);
    const { formatMessage } = useIntl();
    const userRMARequests = [
        {
            product: 'Scarf',
            sku: '000000095',
            order_increment_id: '0000055',
            status_id: 'Pendeing',
            is_canceled: 0,
            updated_at: '1 / 4 / 23',
            created_at: '1 / 4 / 23',
            increment_id: 2
        },
        {
            request_id: '00000058',
            order_id: '000000097',
            order_increment_id: '00000242',
            status_id: 'Pendeing',
            is_canceled: 0,
            updated_at: '1 / 5 / 23',
            created_at: '1 / 5 / 23',
            increment_id: 552
        }
    ];
    const tableHeader = [
        <FormattedMessage id={'rmaPage.productName'} defaultMessage={'Product Name'} />,
        <FormattedMessage id={'rmaPage.sku'} defaultMessage={'SKU'} />,
        <FormattedMessage id={'rmaPage.price'} defaultMessage={'Price'} />,
        <FormattedMessage id={'rmaPage.reason'} defaultMessage={'Reason'} />,
        <FormattedMessage id={'rmaPage.solution'} defaultMessage={'Solution'} />,
        <FormattedMessage id={'rmaPage.additionalField'} defaultMessage={'Additional Field'} />,
        <FormattedMessage id={'rmaPage.qty'} defaultMessage={'Qty'} />
    ];

    const tableRows = item?.request_item.map(req => {
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
                value: req.sku
            },
            {
                dataLable: formatMessage({
                    id: 'rmaPage.price',
                    defaultMessage: 'Price'
                }),
                value: req.price
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
                // value: req.additional_fields
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
        <div>
            <Table headers={tableHeader} tableRows={tableRows} />
        </div>
    );
};

export default ProductDetailsTable;
