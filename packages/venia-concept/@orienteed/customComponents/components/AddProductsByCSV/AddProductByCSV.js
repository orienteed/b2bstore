/*import React, { useEffect, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Upload as UploadFileIcon } from 'react-feather';
import Button from '@magento/venia-ui/lib/components/Button';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { useAddProductsByCSV } from '../../talons/useAddProductsByCSV';
import defaultClasses from '../../css/forms.module.css';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import AddProductErrorPopup from '../AddProductErrorPopup/AddProductErrorPopup';

const AddProductByCSV = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const { formatMessage } = useIntl();

    const {
        csvErrorType,
        setCsvErrorType,
        csvSkuErrorList,
        setCsvSkuErrorList,
        isCsvDialogOpen,
        setIsCsvDialogOpen,
        handleCancelCsvDialog,
        skuList
    } = props;

    const {
        handleCSVFile
    } = useAddProductsByCSV({
        csvErrorType,
        setCsvErrorType,
        csvSkuErrorList,
        setCsvSkuErrorList,
        setIsCsvDialogOpen,
        skuList
    });

    return (
        <>
            <Button
                onClick={handleCSVFile}
                priority="high"
                className={classes.orderUsingCSV}
            >
                <Icon
                    size={16}
                    src={UploadFileIcon}
                    classes={{
                        icon: classes.loadFileIcon
                    }}
                />
                <FormattedMessage
                    id={'AddProductByCSV.orderUsingCSV'} // TODOJ - Translations
                    defaultMessage={'CSV ORDER'}
                />
            </Button>
            <AddProductErrorPopup
                isOpen={isCsvDialogOpen}
                onCancel={handleCancelCsvDialog}
                errorMessage={csvSkuErrorList}
                errorType={csvErrorType}
            />
        </>
    );
};

export default AddProductByCSV;*/
