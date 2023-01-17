import React from 'react';
import defaultClasses from './RMAFrontPage.module.css';
import { useStyle } from '../../classify';
import { FormattedMessage, useIntl } from 'react-intl';
import useRMA from '@magento/peregrine/lib/talons/RMA/useRMA';
import Button from '../Button';
import Table from './Table/Table';
import useRMAFrontPage from '@magento/peregrine/lib/talons/RMA/useRMAFrontPage.js';
import DetailsPopUp from './RMAFrontPageDetails';

const RMAFrontPage = () => {
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses);
    const { handleRedirectCreateRMA, handleCancel, requestsList, filesUploaded, setFilesUploaded } = useRMA({});
    const { handleOpenPopup, handleClosePopup, openPopup } = useRMAFrontPage();

    const tableHeader = [
        <FormattedMessage id={'rmaPage.requestId'} defaultMessage={'Request ID'} />,
        <FormattedMessage id={'rmaPage.orderIncrementId'} defaultMessage={'Order Increment ID'} />,
        <FormattedMessage id={'rmaPage.requestStatus'} defaultMessage={'Request Status'} />,
        <FormattedMessage id={'rmaPage.createdDate'} defaultMessage={'Created Date'} />,
        <FormattedMessage id={'rmaPage.updatedDate'} defaultMessage={'Updated Date'} />,
        <FormattedMessage id={'rmaPage.actions'} defaultMessage={'Actions'} />
    ];
    console.log({ requestsList: requestsList?.items });

    const tableRows = requestsList?.items?.map(req => {
        return [
            {
                dataLable: formatMessage({
                    id: 'rmaPage.requestId',
                    defaultMessage: 'Request ID'
                }),
                value: req.request_id
            },
            {
                dataLable: formatMessage({
                    id: 'rmaPage.orderIncrementId',
                    defaultMessage: 'Order Increment ID'
                }),
                value: req.order_increment_id
            },
            {
                dataLable: formatMessage({
                    id: 'rmaPage.requestStatus',
                    defaultMessage: 'Request Status'
                }),
                value: req.status_id
            },
            {
                dataLable: formatMessage({
                    id: 'rmaPage.createdDate',
                    defaultMessage: 'Created Date'
                }),
                value: req.created_at
            },
            {
                dataLable: formatMessage({
                    id: 'rmaPage.updatedDate',
                    defaultMessage: 'Updated Date'
                }),
                value: req.updated_at
            },
            {
                dataLable: formatMessage({
                    id: 'rmaPage.actions',
                    defaultMessage: 'Actions'
                }),
                classes: classes.actionsWrapper,
                value: (
                    <>
                        <a href className={classes.actionBtn} onClick={() => handleCancel(req)}>
                            <FormattedMessage id={'rmaPage.cancel'} defaultMessage={'Cancel'} />
                        </a>
                        <a href className={classes.actionBtn} onClick={handleOpenPopup}>
                            <FormattedMessage id={'global.seeDetails'} defaultMessage={'See Details'} />
                        </a>
                    </>
                )
            }
        ];
    });

    return (
        <div className={classes.root}>
            <div className={classes.headerWrapper}>
                <h1 className={classes.heading} data-cy="CompareProductsPage-heading">
                    <FormattedMessage id={'rmaPage.RMAReuests'} defaultMessage="RMA Requests" />
                </h1>
                <Button onClick={handleRedirectCreateRMA} priority="high">
                    <FormattedMessage id={'rmaPage.createRMAReq'} defaultMessage={'Create RMA Request'} />
                </Button>
            </div>
            <Table headers={tableHeader} tableRows={tableRows} />
            {requestsList?.items?.length > 0 &&
                requestsList?.items?.map(item => {
                    return (
                        <DetailsPopUp
                            key={item.request_id}
                            openPopup={openPopup}
                            handleClosePopup={handleClosePopup}
                            item={item}
                            filesUploaded={filesUploaded}
                            setFilesUploaded={setFilesUploaded}
                        />
                    );
                })}
        </div>
    );
};

export default RMAFrontPage;
