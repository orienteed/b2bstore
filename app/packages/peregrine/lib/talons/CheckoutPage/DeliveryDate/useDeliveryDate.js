import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useReducer, useMemo } from 'react';

import { useStoreConfigContext } from '../../../context/storeConfigProvider';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

const deliveryDateData = {
    mp_delivery_date: '',
    mp_delivery_time: '',
    mp_house_security_code: '',
    mp_delivery_comment: ''
};

function reducer(state, action) {
    switch (action.type) {
        case 'mp_delivery_date':
            return { ...state, mp_delivery_date: action.value };
        case 'mp_delivery_time':
            return { ...state, mp_delivery_time: action.value };
        case 'mp_house_security_code':
            return { ...state, mp_house_security_code: action.value };
        case 'mp_delivery_comment':
            return { ...state, mp_delivery_comment: action.value };
        default:
            throw new Error();
    }
}

export const useDeliveryDate = () => {
    const [state, dispatch] = useReducer(reducer, deliveryDateData);

    const { getDeliveryDate, setDeliveryTime } = useAdapter();

    const handleChange = (name, value) => {
        dispatch({ type: name, value });
    };

    const { data: storeConfigData } = useStoreConfigContext();

    const local = useMemo(() => {
        return storeConfigData && storeConfigData.storeConfig.locale;
    }, [storeConfigData]);

    const [{ cartId }] = useCartContext();

    const { data: deliveryDate } = getDeliveryDate();

    const { deliverytime } = setDeliveryTime();

    const deliveryDateIsActivated = useMemo(() => {
        if (deliveryDate?.deliveryTime) {
            return Object.keys(deliveryDate?.deliveryTime).every(
                ele => deliveryDate.deliveryTime[ele] || deliveryDate.deliveryTime[ele] === ''
            );
        }
    }, [deliveryDate]);

    const submitDeliveryDate = async () => {
        await deliverytime({
            variables: {
                cart_id: cartId,
                mp_delivery_time: state
            }
        });
    };

    return {
        deliveryDate,
        submitDeliveryDate,
        deliveryDateData: state,
        handleChange,
        local,
        deliveryDateIsActivated
    };
};
