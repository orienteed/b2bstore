import { gql } from '@apollo/client';

import { PriceSummaryFragment } from '../../CartPage/PriceSummary/priceSummaryFragments.gql';
import { ShippingInformationFragment } from '../ShippingInformation/shippingInformationFragments.gql';
import {
    AvailableShippingMethodsCheckoutFragment,
    SelectedShippingMethodCheckoutFragment
} from './shippingMethodFragments.gql';

export const SET_SHIPPING_METHOD = gql`
    mutation SetShippingMethod($cartId: String!, $shippingMethod: ShippingMethodInput!) {
        setShippingMethodsOnCart(input: { cart_id: $cartId, shipping_methods: [$shippingMethod] }) {
            cart {
                id
                # If this mutation causes "free" to become available we need to know.
                available_payment_methods {
                    code
                    title
                }
                ...AvailableShippingMethodsCheckoutFragment
                ...PriceSummaryFragment
                ...SelectedShippingMethodCheckoutFragment
                ...ShippingInformationFragment
            }
        }
    }
    ${AvailableShippingMethodsCheckoutFragment}
    ${PriceSummaryFragment}
    ${SelectedShippingMethodCheckoutFragment}
    ${ShippingInformationFragment}
`;

export default {
    setShippingMethodMutation: SET_SHIPPING_METHOD
};
