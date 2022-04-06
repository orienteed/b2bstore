import React, {useEffect} from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage, useIntl} from 'react-intl';
import {mergeClasses} from '@magento/venia-ui/lib/classify';
import defaultClasses from './savedCartButton.module.css';
import Button from '@magento/venia-ui/lib/components/Button';
import { useSavedCart } from '../../talons/SavedCarts/useSavedCart';
import { useToasts } from '@magento/peregrine';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { AlertCircle as AlertCircleIcon } from 'react-feather';
import SavedCartPopup from './savedCartPopup';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';


const errorIcon = (
    <Icon
        src={AlertCircleIcon}
        attrs={{
            width: 18
        }}
    />
);

const savedCartButton = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const talonProps = useSavedCart();
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();

    const { 
        isShow,
        buttonTitle,
        isSaveCartLoading, 
        handleSaveCart, 
        isError, 
        errorMessage, 
        isDialogOpen, 
        handleCancelDialog,
        handleSubmitDialog
    } = talonProps;

    const savedCartBtn = (
        <Button
            onClick={handleSaveCart}
            priority={'normal'}
        >
            <FormattedMessage
                id={'savedCartButton.saveCartBtn'}
                defaultMessage={buttonTitle}
            />
        </Button>
    );

    if(!isShow){
        return null
    }

    return (
        <div className={classes.root}>
            {savedCartBtn}
            <SavedCartPopup 
                isOpen={isDialogOpen}
                onCancel={handleCancelDialog}
                handleSubmit={handleSubmitDialog}
                errorMessage={errorMessage}
                isError={isError}
                shouldDisableAllButtons={isSaveCartLoading}
            />
        </div>
    );
};

export default savedCartButton;

savedCartButton.propTypes = {
    classes: shape({
        root: string,
    })
};