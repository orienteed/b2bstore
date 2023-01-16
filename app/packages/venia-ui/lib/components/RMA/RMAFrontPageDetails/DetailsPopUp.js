/* eslint-disable react/jsx-no-literals */
import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Dialog from '../../Dialog';
import { useStyle } from '../../../classify';
import defaultClasses from './DetailsPopUp.module.css';
import TextArea from '../../TextArea';

import DropzonePrevisualizer from '../DropzonePrevisualizer';
import ProductDetailsTable from './ProductDetailsTable';

const DetailsPopUp = ({ openPopup, handleClosePopup, item }) => {
    const classes = useStyle(defaultClasses);
    const dialogButtonsArray = [];
    const [comment, setComment] = useState('');

    const { formatMessage } = useIntl();

    const detailsTitle = <FormattedMessage id={'detailsTitle'} defaultMessage={'Details'} />;
    const orderRequestInformationTitle = (
        <FormattedMessage id={'orderRequestInformation'} defaultMessage={'Order Request Information'} />
    );

    const requestID = formatMessage({
        id: 'requestID',
        defaultMessage: 'Request ID'
    });

    const orderID = formatMessage({
        id: 'orderId',
        defaultMessage: 'Order ID'
    });

    const orderIncrementID = formatMessage({
        id: 'orderIncrementID',
        defaultMessage: 'Order Increment ID'
    });
    const createdAt = formatMessage({
        id: 'createdAt',
        defaultMessage: 'Created At'
    });
    const returnShippingInformation = formatMessage({
        id: 'returnShippingInformation',
        defaultMessage: 'Return Shipping Information '
    });
    const shippingReturnMessage = formatMessage({
        id: 'shippingReturnMessage',
        defaultMessage: 'There is no shipping label for this request'
    });
    const rmaInformationTitle = formatMessage({
        id: 'rmaInformationTitle',
        defaultMessage: 'RMA Information'
    });
    const commentSection = formatMessage({
        id: 'commentSection',
        defaultMessage: 'Comment'
    });

    const conversation = formatMessage({
        id: 'conversation',
        defaultMessage: 'Conversation'
    });
    const returnShippingInformationArray = [];

    return (
        <Dialog
            title={detailsTitle}
            isOpen={openPopup}
            shouldUseButtonsArray={true}
            onCancel={handleClosePopup}
            buttonsArray={dialogButtonsArray}
        >
            <main>
                <div className={classes.orderRequestInformationContainer}>
                    <h3>{orderRequestInformationTitle}</h3>
                    <hr />
                    <div className={classes.orderRequestInformation}>
                        <p>{`${requestID} : ${item.request_id}`}</p>
                        <p>{`${orderID} : ${item.order_id}`}</p>
                        <p>{`${orderIncrementID} : ${item.order_increment_id}`}</p>
                        <p>{`${createdAt} : ${item.created_at}`}</p>
                    </div>
                </div>
                <div className={classes.returnShippingInformationContainer}>
                    <h3>{returnShippingInformation}</h3>
                    <hr />
                    <div className={classes.returnShippingInformation}>
                        {returnShippingInformationArray.length > 0 ? 'Info' : shippingReturnMessage}
                    </div>
                </div>

                <div className={classes.rmaInformationContainer}>
                    <h3>{rmaInformationTitle}</h3>
                    <hr />

                    <div className={classes.rmaInformation}>
                        <ProductDetailsTable item={item} />
                    </div>
                </div>

                <div className={classes.commentContainer}>
                    <h3>{commentSection}</h3>
                    <hr />
                    <div className={classes.commentArea}>
                        <TextArea id="rmaRequestFormComment" field="comment" value={comment} maxLength={10000} />
                    </div>
                </div>

                <div className={classes.conversationContainer}>
                    <h3>{conversation}</h3>
                    <hr />

                    <div className={classes.conversationDropzone}>
                        <DropzonePrevisualizer />
                    </div>
                </div>
            </main>
        </Dialog>
    );
};

export default DetailsPopUp;
