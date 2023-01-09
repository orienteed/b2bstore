import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Table from '../Table/Table';

const ProductDetailsTable = () => {
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

    const tableRows = userRMARequests.map(req => {
        return [
            {
                dataLable: formatMessage({
                    id: 'rmaPage.productName',
                    defaultMessage: 'Product Name'
                }),
                value: 'Mock product'
            },
            {
                dataLable: formatMessage({
                    id: 'rmaPage.sku',
                    defaultMessage: 'SKU'
                }),
                value: 'Mock sku'
            },
            {
                dataLable: formatMessage({
                    id: 'rmaPage.price',
                    defaultMessage: 'Price'
                }),
                value: 'mock price'
            },
            {
                dataLable: formatMessage({
                    id: 'rmaPage.reason',
                    defaultMessage: 'Reason'
                }),
                value: 'Mock reason'
            },
            {
                dataLable: formatMessage({
                    id: 'rmaPage.solution',
                    defaultMessage: 'Solution'
                }),
                value: 'Mock solution'
            },
            {
                dataLable: formatMessage({
                    id: 'rmaPage.additionalField',
                    defaultMessage: 'Additional Field'
                }),
                value: 'Mock additional field'
            },
            {
                dataLable: formatMessage({
                    id: 'rmaPage.qty',
                    defaultMessage: 'Qty'
                }),
                value: 'Mock qty'
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
