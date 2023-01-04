/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from 'react';
import defaultClasses from './RMAFrontPage.module.css';
import { useStyle } from '../../classify';
import { FormattedMessage, useIntl } from 'react-intl';
import useRMA from '@magento/peregrine/lib/talons/RMA/useRMA';
import Button from '../Button';

const RMAFrontPage = () => {
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses);
    const { userRMARequests, handleRedirectCreateRMA, handleCancel, handleOpenRequestDetails } = useRMA({});
    const tableRMARequests = useMemo(
        () =>
            userRMARequests.map(req => (
                <tr key={req.request_id}>
                    <td
                        data-label={formatMessage({
                            id: 'rmaPage.RMAReuests',
                            defaultMessage: 'Request ID'
                        })}
                    >
                        {req.request_id}
                    </td>
                    <td
                        data-label={formatMessage({
                            id: 'rmaPage.orderIncrementId',
                            defaultMessage: 'Order Increment ID'
                        })}
                    >
                        {req.order_increment_id}
                    </td>
                    <td
                        data-label={formatMessage({
                            id: 'rmaPage.requestStatus',
                            defaultMessage: 'Request Status'
                        })}
                    >
                        {req.status_id}
                    </td>
                    <td
                        data-label={formatMessage({
                            id: 'rmaPage.createdDate',
                            defaultMessage: 'Created Date'
                        })}
                    >
                        {req.created_at}
                    </td>
                    <td
                        data-label={formatMessage({
                            id: 'rmaPage.updatedDate',
                            defaultMessage: 'Updated Date'
                        })}
                    >
                        {req.updated_at}
                    </td>{' '}
                    <td
                        data-label={formatMessage({
                            id: 'rmaPage.actions',
                            defaultMessage: 'Actions'
                        })}
                        className={classes.actionsWrapper}
                    >
                        <a href className={classes.actionBtn} onClick={() => handleCancel(req)}>
                            <FormattedMessage id={'global.cancel'} defaultMessage={'Cancel'} />
                        </a>
                        <a href className={classes.actionBtn} onClick={() => handleOpenRequestDetails(req)}>
                            <FormattedMessage id={'global.seeDetails'} defaultMessage={'See Details'} />
                        </a>
                    </td>
                </tr>
            )),
        [userRMARequests]
    );
    return (
        <div className={classes.root}>
            <div className={classes.headerWrapper}>
                <h1 className={classes.heading} data-cy="CompareProductsPage-heading">
                    <FormattedMessage id={'rmaPage.RMAReuests'} defaultMessage="RMA Requests" />
                </h1>
                <Button onClick={handleRedirectCreateRMA} priority="high">
                    <FormattedMessage id={'rmaPage.createRMA Req'} defaultMessage={'Create RMA Request'} />
                </Button>
            </div>
            <table className={classes.creditTable}>
                <thead>
                    <tr>
                        <th scope="col">
                            <FormattedMessage id={'rmaPage.requestId'} defaultMessage={'Request ID'} />
                        </th>
                        <th scope="col">
                            <FormattedMessage id={'rmaPage.orderIncrementId'} defaultMessage={'Order Increment ID'} />
                        </th>
                        <th scope="col">
                            <FormattedMessage id={'rmaPage.requestStatus'} defaultMessage={'Request Status'} />
                        </th>
                        <th scope="col">
                            <FormattedMessage id={'rmaPage.createdDate'} defaultMessage={'Created Date'} />
                        </th>
                        <th scope="col">
                            <FormattedMessage id={'rmaPage.updatedDate'} defaultMessage={'Updated Date'} />
                        </th>
                        <th scope="col">
                            <FormattedMessage id={'rmaPage.actions'} defaultMessage={'Actions'} />
                        </th>
                    </tr>
                </thead>
                <tbody>{tableRMARequests}</tbody>
            </table>
        </div>
    );
};

export default RMAFrontPage;
