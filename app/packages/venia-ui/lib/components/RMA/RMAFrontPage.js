import React from 'react';
import defaultClasses from './RMAFrontPage.module.css';
import { useStyle } from '../../classify';
import { FormattedMessage, useIntl } from 'react-intl';
import useRMA from '@magento/peregrine/lib/talons/RMA/useRMA';
import Button from '../Button';
import Table from './Table/Table';
import useRMAFrontPage from '@magento/peregrine/lib/talons/RMA/useRMAFrontPage.js';
import DetailsPopUp from './RMAFrontPageDetails';
import LoadingIndicator from '../LoadingIndicator';

const RMAFrontPage = () => {
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses);
    const { handleRedirectCreateRMA, handleCancel, requestsList, refetchRequest } = useRMA({});
    const {
        handleOpenPopup,
        handleClosePopup,
        openPopup,
        selectedItem,
        filesUploaded,
        setFilesUploaded,
        handleSubmitConversation,
        setComment,
        comment,
        isSubmit
    } = useRMAFrontPage({ refetchRequest, requestsList });

    const tableHeader = [
        <FormattedMessage id={'rmaPage.requestId'} defaultMessage={'Request ID'} />,
        <FormattedMessage id={'rmaPage.orderIncrementId'} defaultMessage={'Order Increment ID'} />,
        <FormattedMessage id={'rmaPage.requestStatus'} defaultMessage={'Request Status'} />,
        <FormattedMessage id={'rmaPage.createdDate'} defaultMessage={'Created Date'} />,
        <FormattedMessage id={'rmaPage.updatedDate'} defaultMessage={'Updated Date'} />,
        <FormattedMessage id={'rmaPage.actions'} defaultMessage={'Actions'} />
    ];

    const noRequestsMessage = formatMessage({
        id: 'rmaPage.noRequestsMessage',
        defaultMessage: 'There are no requests yet'
    });

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
                value: req.status?.label
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
                        {req.is_canceled === 0 && (
                            <a href className={classes.actionBtn} onClick={() => handleCancel(req)}>
                                <FormattedMessage id={'rmaPage.cancel'} defaultMessage={'Cancel'} />
                            </a>
                        )}
                        <a href className={classes.actionBtn} onClick={() => handleOpenPopup(req)}>
                            <FormattedMessage id={'global.seeDetails'} defaultMessage={'See Details'} />
                        </a>
                    </>
                )
            }
        ];
    });
    if (!requestsList) return <LoadingIndicator />;

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
            {requestsList?.items.length > 0 ? (
                <Table headers={tableHeader} tableRows={tableRows} />
            ) : (
                <span>{noRequestsMessage}</span>
            )}
            {openPopup && (
                <DetailsPopUp
                    setComment={setComment}
                    key={selectedItem?.request_id}
                    openPopup={openPopup}
                    handleClosePopup={handleClosePopup}
                    item={requestsList.items.find(ele => ele.request_id === selectedItem.request_id)}
                    filesUploaded={filesUploaded}
                    onConfirm={handleSubmitConversation}
                    setFilesUploaded={setFilesUploaded}
                    comment={comment}
                    isSubmit={isSubmit}
                />
            )}
            {/* <p> {noRequestsMessage}</p> */}
        </div>
    );
};

export default RMAFrontPage;
