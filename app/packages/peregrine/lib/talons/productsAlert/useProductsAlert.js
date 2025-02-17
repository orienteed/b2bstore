/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { AlertCircle as AlertCircleIcon } from 'react-feather';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useToasts } from '../../Toasts';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';
import Icon from '@magento/venia-ui/lib/components/Icon';

const errorIcon = <Icon src={AlertCircleIcon} size={20} />;

export const useProductsAlert = props => {
    const { formatMessage } = useIntl();
    const selectProductSku = props?.selectedVarient?.product?.sku;
    const {
        submitCustomerPriceAlert: submitCustomerPriceAlertFromAdapter,
        getCustomerAlerts,
        submitGuestPriceAlert: submitGuestPriceAlertFromAdapter,
        submitCustomerStockAlert: submitCustomerStockAlertFromAdapter,
        submitGuestStockAlert: submitGuestStockAlertFromAdapter,
        submitDeleteAlert: submitDeleteAlertFromAdapter,
        getConfigAlerts,
        getLocale
    } = useAdapter();
    const simpleProductB2CSku = props?.simpleProductData?.sku;
    const itemSku = props?.ItemSku;
    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);
    const [formEmail] = useState();
    const [selectedOptionB2C, setSelectedOptionB2C] = useState('');

    const { data: alertConfig } = getConfigAlerts();
    const { data: storeData } = getLocale();
    const local = useMemo(() => {
        return storeData && storeData.storeConfig.locale;
    }, [storeData]);

    const formProps = {
        initialValues: formEmail
    };
    const outOfStockProducts = props?.isOutOfStockProduct;

    const [, { addToast }] = useToasts();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isStockModalOpened, setisStockModalOpened] = useState(false);
    const [openPriceModal, setOpenPriceModal] = useState(false);
    const [stockPageControl, setStockPageControl] = useState({});
    const [priceControlPage, setPriceControlPage] = useState({});

    const [{ isSignedIn }] = useUserContext();
    const { loading, data: customersAlertsItems, refetch } = getCustomerAlerts({
        priceCurrentPage: priceControlPage?.currentPage,
        stockCurrentPage: stockPageControl?.currentPage
    });
    const { submitCustomerPriceAlert } = submitCustomerPriceAlertFromAdapter();
    const { submitGuestPriceAlert } = submitGuestPriceAlertFromAdapter();
    const { submitCustomerStockAlert } = submitCustomerStockAlertFromAdapter();
    const { submitGuestStockAlert } = submitGuestStockAlertFromAdapter();
    const { submitDeleteAlertAPI } = submitDeleteAlertFromAdapter();
    const selectTitle = formatMessage({
        id: 'productAlerts.pleaseSelect',
        defaultMessage: 'Notify me about the product availability '
    });

    if (selectedOptionB2C === selectTitle) {
        setSelectedOptionB2C('');
    }

    const outStockProductsSku = useMemo(() => {
        const handleOutStockProducts = () => {
            const productSku = outOfStockProducts?.map(item => {
                return {
                    value: item?.product?.sku,
                    label: item?.product?.name
                };
            });

            if (productSku) return [{ value: selectTitle, label: selectTitle }, ...productSku];
        };
        return handleOutStockProducts();
    }, [outOfStockProducts, selectTitle]);

    useEffect(() => {
        if (customersAlertsItems) {
            const stockAlert = customersAlertsItems?.customer?.mp_product_alert?.out_of_stock;
            const priceAlert = customersAlertsItems?.customer?.mp_product_alert?.product_price;
            setStockPageControl({
                currentPage: stockAlert?.pageInfo?.currentPage,
                totalPages: Math.ceil(stockAlert.total_count / stockAlert?.pageInfo?.pageSize)
            });
            setPriceControlPage({
                currentPage: priceAlert?.pageInfo?.currentPage,
                totalPages: Math.ceil(priceAlert.total_count / priceAlert?.pageInfo?.pageSize)
            });
        }
    }, [customersAlertsItems]);

    const handleOpendStockModal = () => setisStockModalOpened(true);

    const handleOpenPriceModal = () => setOpenPriceModal(true);

    const handleCloseModal = () => {
        setisStockModalOpened(false);
        setOpenPriceModal(false);
    };

    const addedSuccsessfully = () =>
        addToast({
            type: 'success',
            message: (
                <FormattedMessage
                    id="productAlert.requestProductAlert"
                    defaultMessage="The product alert was send successfully"
                />
            ),
            timeout: 5000
        });
    const handleSubmitPriceAlert = useCallback(
        async apiValue => {
            const sku = itemSku || selectedOptionB2C || simpleProductB2CSku || selectProductSku;
            try {
                if (isSignedIn) {
                    await submitCustomerPriceAlert({
                        variables: {
                            productSku: sku
                        }
                    });
                    handleCloseModal();
                } else {
                    await submitGuestPriceAlert({
                        variables: {
                            productSku: sku,
                            email: apiValue?.email
                        }
                    });
                    handleCloseModal();
                }

                addedSuccsessfully();
            } catch (error) {
                return addToast({
                    type: 'error',
                    icon: errorIcon,
                    message: error.message,
                    timeout: 6000
                });
            }
        },
        [
            submitCustomerPriceAlert,
            submitGuestPriceAlert,
            isSignedIn,
            selectProductSku,
            simpleProductB2CSku,
            selectedOptionB2C,
            itemSku
        ]
    );

    const handleChangeProductSku = useCallback(e => {
        setSelectedOptionB2C(e);
    }, []);
    const submitStockAlert = useCallback(
        async apiValue => {
            try {
                const sku = itemSku || selectedOptionB2C || simpleProductB2CSku || selectProductSku;
                if (isSignedIn) {
                    await submitCustomerStockAlert({
                        variables: {
                            productSku: sku
                        }
                    });
                    addedSuccsessfully();
                    handleCloseModal();
                } else {
                    await submitGuestStockAlert({
                        variables: {
                            productSku: sku,
                            email: apiValue?.email
                        }
                    });
                    addedSuccsessfully();
                    handleCloseModal();
                }
            } catch (error) {
                return addToast({
                    type: 'error',
                    icon: errorIcon,
                    message: error.message,
                    timeout: 6000
                });
            }
        },
        [
            submitGuestStockAlert,
            isSignedIn,
            submitCustomerStockAlert,
            itemSku,
            selectedOptionB2C,
            selectProductSku,
            simpleProductB2CSku
        ]
    );

    const submitDeleteAlert = useCallback(
        async id => {
            try {
                await submitDeleteAlertAPI({
                    variables: {
                        id
                    }
                });
                refetch();
                addToast({
                    type: 'success',
                    message: (
                        <FormattedMessage
                            id="productAlert.deleted"
                            defaultMessage="The product alert has been successfully removed"
                        />
                    ),
                    timeout: 5000
                });
            } catch (error) {
                console.log({ error });
                return addToast({
                    type: 'error',
                    icon: errorIcon,
                    message: (
                        <FormattedMessage
                            id={'quickOrder.somethingWentWrongTryAgainLater'}
                            defaultMessage={'something went wrong, try again later'}
                        />
                    ),
                    timeout: 6000
                });
            }
        },
        [submitDeleteAlertAPI]
    );

    return {
        loading,
        customersAlertsItems: customersAlertsItems?.customer?.mp_product_alert,
        handleSubmitPriceAlert,
        submitStockAlert,
        formProps,
        isModalOpen,
        setIsModalOpen,
        isStockModalOpened,
        setisStockModalOpened,
        handleOpendStockModal,
        isUserSignIn: isSignedIn,
        submitDeleteAlert,
        setStockPageControl,
        stockPageControl,
        priceControlPage,
        setPriceControlPage,
        handleCloseModal,
        setFormApi,
        handleOpenPriceModal,
        openPriceModal,
        outStockProductsSku,
        handleChangeProductSku,
        selectedOptionB2C,
        local,
        alertConfig: alertConfig?.MpProductAlertsConfigs
    };
};
