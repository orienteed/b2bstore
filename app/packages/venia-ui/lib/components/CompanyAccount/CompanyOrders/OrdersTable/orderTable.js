import React, { useMemo } from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { FormattedMessage, useIntl } from 'react-intl';
import moment from 'moment';
import defaultClasses from './orderTable.module.css';

const OrderTable = props => {
    const { orders, handleReOrderBtn } = props;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses);
    console.log(orders, 'companyOrders');

    const ordersRow = useMemo(() => {
        return orders?.map(ele => {
            const { date, order_number, grand_total, placed_by, ship_to, status } = ele;
            return (
                <tr key={order_number} className={classes.rowTable}>
                    <td
                        scope="row"
                        data-label={formatMessage({ id: 'companyAccount.order', defaultMessage: 'Order' })}
                        className={classes.tableCell}
                    >
                        {order_number}
                    </td>
                    <td
                        data-label={formatMessage({ id: 'companyAccount.date', defaultMessage: 'Date' })}
                        className={classes.tableCell}
                    >
                        {moment(date).format('DD/MM/YYYY')}
                    </td>
                    <td
                        data-label={formatMessage({ id: 'companyAccount.shipTo', defaultMessage: 'Ship To' })}
                        className={classes.tableCell}
                    >
                        {ship_to}
                    </td>
                    <td
                        data-label={formatMessage({ id: 'companyAccount.orderTotal', defaultMessage: 'Order Total' })}
                        className={classes.tableCell}
                    >
                        {grand_total}
                    </td>
                    <td
                        data-label={formatMessage({ id: 'companyAccount.status', defaultMessage: 'Status' })}
                        className={classes.tableCell}
                    >
                        {status}
                    </td>
                    <td
                        data-label={formatMessage({ id: 'companyAccount.placedBy', defaultMessage: 'Placed By' })}
                        className={classes.tableCell}
                    >
                        {placed_by}
                    </td>
                </tr>
            );
        });
    }, [orders]);
    return (
        <div className={classes.tableWrapper}>
            <table className={classes.tableUsers}>
                <thead>
                    <tr className={classes.headerRow}>
                        <th scope="col" className={classes.headerCeil}>
                            <FormattedMessage id={'companyAccount.order'} defaultMessage="Order" />
                        </th>
                        <th scope="col" className={classes.headerCeil}>
                            <FormattedMessage id={'companyAccount.date'} defaultMessage="Date" />
                        </th>
                        <th scope="col" className={classes.headerCeil}>
                            <FormattedMessage id={'companyAccount.shipTo'} defaultMessage="Ship To" />
                        </th>
                        <th scope="col" className={classes.headerCeil}>
                            <FormattedMessage id={'companyAccount.orderTotal'} defaultMessage="Order Total" />
                        </th>
                        <th scope="col" className={classes.headerCeil}>
                            <FormattedMessage id={'companyAccount.status'} defaultMessage="Status" />
                        </th>
                        <th scope="col" className={classes.headerCeil}>
                            <FormattedMessage id={'companyAccount.placedBy'} defaultMessage="Placed By" />
                        </th>
                    </tr>
                </thead>
                <tbody>{ordersRow}</tbody>
            </table>
        </div>
    );
};

export default OrderTable;
