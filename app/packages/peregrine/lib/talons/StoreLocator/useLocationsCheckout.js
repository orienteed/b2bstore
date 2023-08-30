/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState, useMemo } from 'react';
import { useToasts } from '@magento/peregrine';
import { useCartContext } from '../../context/cart';
import { useIntl } from 'react-intl';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

export const useLocationsCheckout = () => {
    const [{ cartId }] = useCartContext();
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();

    const [isLocationsModalOpen, setIsLocationsModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState();
    const [selectedDay, setSelectedDay] = useState();
    const {
        getLocale,
        getLocationsCart,
        getLocationHolidays,
        submitLocation,
        getStoreId
    } = useAdapter();

    const { data, loading } = getLocationsCart({ cartId });
    const { data: storeData } = getStoreId();
    const { data: locationsHolidays, loading: holidaysLoading } = getLocationHolidays({ storeId: storeData?.storeConfig?.id });

    const { data: localData } = getLocale();

    const local = useMemo(() => {
        return localData && localData.storeConfig.locale;
    }, [localData]);
    const { handleSubmitLocation, loading: isSubmtiting } = submitLocation();

    // const locationsData = useMemo(() => data?.MpStoreLocatorPickupLocationList, [data]);

    const holidayDates = useMemo(() => {
        if (selectedLocation) {
            const location = locationsHolidays?.MpStoreLocatorConfig?.locationsData.find(
                ({ name }) => selectedLocation?.name === name
            );
            return location ? location?.holidayData : [];
        }
    }, [selectedLocation, locationsHolidays]);

    const handleOpenLocationModal = () => {
        setIsLocationsModalOpen(!isLocationsModalOpen);
        setSelectedLocation();
    };

    const handleChangeDay = val => setSelectedDay(val);

    const handleSelectLocation = location => setSelectedLocation(location);

    const submutLocation = useCallback(async () => {
        try {
            await handleSubmitLocation({
                variables: {
                    locationId: selectedLocation?.location_id,
                    timePickup: selectedDay,
                    cartId
                }
            });
            setIsLocationsModalOpen(false);
            setSelectedLocation({ ...selectedLocation, isSubmited: true, selectedDay });
            addToast({
                type: 'success',

                message: formatMessage({
                    id: 'storeLocation.AddedSuccessfully',
                    defaultMessage: 'Added the store successfully'
                }),
                timeout: 6000
            });
        } catch (error) {
            addToast({
                type: 'error',
                message: formatMessage({
                    id: 'quickOrder.somethingWentWrongTryAgainLater',
                    defaultMessage: 'something went wrong, try again later'
                }),
                timeout: 6000
            });
        }
    }, [handleSubmitLocation, selectedDay, selectedLocation]);

    return {
        isLocationsModalOpen,
        handleOpenLocationModal,
        loading: loading || isSubmtiting || holidaysLoading,
        locationsData: data?.MpStoreLocatorPickupLocationList,
        submutLocation,
        selectedLocation,
        handleSelectLocation,
        holidayDates,
        handleChangeDay,
        local
    };
};
