/* eslint-disable react/jsx-no-literals */
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Dialog from '../../Dialog';
import { useStyle } from '../../../classify';
import defaultClasses from './DetailsPopUp.module.css';
import moment from 'moment';
import { Download } from 'react-feather';

import DropzonePrevisualizer from '../DropzonePrevisualizer';
import ProductDetailsTable from './ProductDetailsTable';
import Icon from '../../Icon';
import Button from '../../Button';

const DetailsPopUp = ({
    openPopup,
    handleClosePopup,
    item,
    filesUploaded,
    setFilesUploaded,
    onConfirm,
    isSubmit,
    setComment,

    comment
}) => {
    const classes = useStyle(defaultClasses);
    const dialogButtonsArray = [];
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
                        <span className={classes.orderIdSpan}>{requestID}</span> <span>{`: ${item.request_id}`}</span>
                        <br />
                        <span className={classes.orderIdSpan}>{orderID}</span> <span>{`: ${item.order_id}`}</span>
                        <br />
                        <span className={classes.orderIdSpan}>{orderIncrementID}</span>{' '}
                        <span>{`: ${item.order_increment_id}`}</span>
                        <br />
                        <span className={classes.orderIdSpan}>{createdAt}</span> <span>{`: ${item.created_at}`}</span>
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
                <div className={classes.conversationContainer}>
                    <div className={classes.commentContainer}>
                        <h3>{commentSection}</h3>
                        <hr />
                        <textarea
                            className={classes.commentArea}
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                        />
                    </div>
                    <div>
                        <hr />
                        <div className={classes.conversationDropzone}>
                            <DropzonePrevisualizer filesUploaded={filesUploaded} setFilesUploaded={setFilesUploaded} />
                        </div>
                        <div className={classes.submitBtn}>
                            <Button disabled={isSubmit} priority="high" onClick={() => onConfirm(item.request_id)}>
                                <FormattedMessage id={'submitButtonText'} defaultMessage={'Submit'} />
                            </Button>
                        </div>
                        {item.request_reply?.length > 0 && <h3>{conversation}</h3>}

                        {item.request_reply?.map(reply => (
                            <div className={classes.conversationBox}>
                                <div className={classes.header}>
                                    <span>
                                        <span className={classes.auther}>{reply.author_name + '  '}</span>
                                        {moment(new Date(reply.created_at)).format('LLLL')}
                                    </span>
                                </div>
                                <div className={classes.content}>{reply.content}</div>
                                {reply.files && (
                                    <div className={classes.files}>
                                        {reply.files?.map(link => (
                                            <a target="blank" key={link} download href={link}>
                                                <Icon src={Download} size={20} />
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </Dialog>
    );
};

export default DetailsPopUp;
