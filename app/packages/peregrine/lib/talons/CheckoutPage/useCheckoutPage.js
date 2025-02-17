import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useApolloClient } from '@apollo/client';
import { useEventingContext } from '../../context/eventing';

import { useUserContext } from '../../context/user';
import { useCartContext } from '../../context/cart';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

import CheckoutError from './CheckoutError';
import { useGoogleReCaptcha } from '../../hooks/useGoogleReCaptcha';

import ReactGA from 'react-ga';
import { useNoReorderProductContext } from '@magento/venia-ui/lib/components/NoReorderProductProvider/noReorderProductProvider.js';

export const CHECKOUT_STEP = {
    SHIPPING_ADDRESS: 1,
    SHIPPING_METHOD: 2,
    PAYMENT: 3,
    REVIEW: 4
};

/**
 *
 * @param {DocumentNode} props.operations.getCheckoutDetailsQuery query to fetch checkout details
 * @param {DocumentNode} props.operations.getCustomerInformationQuery query to fetch customer details
 * @param {DocumentNode} props.operations.getOrderDetailsQuery query to fetch order details
 * @param {DocumentNode} props.operations.createCartMutation mutation to create a new cart
 * @param {DocumentNode} props.operations.placeOrderMutation mutation to place order
 *
 * @returns {
 *  activeContent: String,
 *  availablePaymentMethods: Array,
 *  cartItems: Array,
 *  checkoutStep: Number,
 *  customer: Object,
 *  error: ApolloError,
 *  handlePlaceOrder: Function,
 *  hasError: Boolean,
 *  isCartEmpty: Boolean,
 *  isGuestCheckout: Boolean,
 *  isLoading: Boolean,
 *  isUpdating: Boolean,
 *  orderDetailsData: Object,
 *  orderDetailsLoading: Boolean,
 *  orderNumber: String,
 *  placeOrderLoading: Boolean,
 *  setCheckoutStep: Function,
 *  setIsUpdating: Function,
 *  setShippingInformationDone: Function,
 *  setShippingMethodDone: Function,
 *  setPaymentInformationDone: Function,
 *  scrollShippingInformationIntoView: Function,
 *  shippingInformationRef: ReactRef,
 *  shippingMethodRef: ReactRef,
 *  scrollShippingMethodIntoView: Function,
 *  resetReviewOrderButtonClicked: Function,
 *  handleReviewOrder: Function,
 *  reviewOrderButtonClicked: Boolean,
 *  toggleAddressBookContent: Function,
 *  toggleSignInContent: Function,
 * }
 */
export const useCheckoutPage = props => {
    const { submitDeliveryDate, deliveryDateIsActivated, submitOrderAttribute } = props;

    const {
        placeOrder,
        createCart: createCartFromAdapter,
        getCheckoutDetails,
        getOrderDetails: getOrderDetailsFromAdapter,
        setPaymentMethodOnCart,
        getCustomerInformation
    } = useAdapter();

    const { setNoProduct } = useNoReorderProductContext();

    const { generateReCaptchaData, recaptchaWidgetProps } = useGoogleReCaptcha({
        currentForm: 'PLACE_ORDER',
        formAction: 'placeOrder'
    });

    const [reviewOrderButtonClicked, setReviewOrderButtonClicked] = useState(false);

    const shippingInformationRef = useRef();
    const shippingMethodRef = useRef();

    const apolloClient = useApolloClient();
    const [isUpdating, setIsUpdating] = useState(false);
    const [placeOrderButtonClicked, setPlaceOrderButtonClicked] = useState(false);
    const [activeContent, setActiveContent] = useState('checkout');
    const [checkoutStep, setCheckoutStep] = useState(CHECKOUT_STEP.SHIPPING_ADDRESS);
    const [guestSignInUsername, setGuestSignInUsername] = useState('');
    const [currentSelectedPaymentMethod, setCurrentSelectedPaymentMethod] = useState('');
    const [resetEditing, setResetEditing] = useState(false);

    const [{ isSignedIn }] = useUserContext();
    const [{ cartId }, { createCart, removeCart }] = useCartContext();

    const { fetchCartId } = createCartFromAdapter();
    const { runPlaceOrder, data: placeOrderData, loading: placeOrderLoading, error: placeOrderError } = placeOrder();

    const { getOrderDetails, data: orderDetailsData, loading: orderDetailsLoading } = getOrderDetailsFromAdapter();

    const { data: customerData, loading: customerLoading } = getCustomerInformation({ hasSkip: true, isSignedIn: isSignedIn });

    const { data: checkoutData, networkStatus: checkoutQueryNetworkStatus } = getCheckoutDetails({ cartId: cartId })

    const {
        fetch: updatePaymentMethod,
        error: paymentMethodMutationError,
        called: paymentMethodMutationCalled,
        loading: paymentMethodMutationLoading
    } = setPaymentMethodOnCart();

    const paymentMethodMutationData = {
        paymentMethodMutationError,
        paymentMethodMutationCalled,
        paymentMethodMutationLoading
    };

    const onBillingAddressChangedSuccess = useCallback(() => {
        if (currentSelectedPaymentMethod && currentSelectedPaymentMethod.code) {
            updatePaymentMethod({
                variables: { cartId, payment_method: currentSelectedPaymentMethod }
            });
        }
    }, [updatePaymentMethod, cartId, currentSelectedPaymentMethod, currentSelectedPaymentMethod]);

    const cartItems = useMemo(() => {
        return (checkoutData && checkoutData?.cart?.items) || [];
    }, [checkoutData]);

    /**
     * For more info about network statues check this out
     *
     * https://www.apollographql.com/docs/react/data/queries/#inspecting-loading-states
     */
    const isLoading = useMemo(() => {
        const checkoutQueryInFlight = checkoutQueryNetworkStatus ? checkoutQueryNetworkStatus < 7 : true;

        return checkoutQueryInFlight || customerLoading;
    }, [checkoutQueryNetworkStatus, customerLoading]);

    const customer = customerData && customerData.customer;

    const toggleAddressBookContent = useCallback(() => {
        setActiveContent(currentlyActive => (currentlyActive === 'checkout' ? 'addressBook' : 'checkout'));
    }, []);
    const toggleSignInContent = useCallback(() => {
        setActiveContent(currentlyActive => (currentlyActive === 'checkout' ? 'signIn' : 'checkout'));
    }, []);

    const checkoutError = useMemo(() => {
        if (placeOrderError) {
            return new CheckoutError(placeOrderError);
        }
    }, [placeOrderError]);

    const handleReviewOrder = () => {
        setResetEditing(false);
        if (deliveryDateIsActivated) submitDeliveryDate();
        submitOrderAttribute();
        ReactGA.event({
            category: 'Checkout page',
            action: 'Review order clicked',
            label: `Checkout page- Review order clicked`
        });
        setReviewOrderButtonClicked(true);
    };

    const handleBackToReview = useCallback(() => {
        setCheckoutStep(CHECKOUT_STEP.SHIPPING_ADDRESS);
        resetReviewOrderButtonClicked();
        setResetEditing(true);
        setCurrentSelectedPaymentMethod('');
    }, []);

    const resetReviewOrderButtonClicked = useCallback(() => {
        setReviewOrderButtonClicked(false);
    }, []);

    const onBillingAddressChangedError = useCallback(() => {
        resetReviewOrderButtonClicked();
    }, [resetReviewOrderButtonClicked]);

    const scrollShippingInformationIntoView = useCallback(() => {
        if (shippingInformationRef.current) {
            shippingInformationRef.current.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }, [shippingInformationRef]);

    const setShippingInformationDone = useCallback(() => {
        if (checkoutStep === CHECKOUT_STEP.SHIPPING_ADDRESS) {
            setCheckoutStep(CHECKOUT_STEP.SHIPPING_METHOD);
        }
    }, [checkoutStep]);

    const scrollShippingMethodIntoView = useCallback(() => {
        if (shippingMethodRef.current) {
            shippingMethodRef.current.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }, [shippingMethodRef]);

    const setShippingMethodDone = useCallback(() => {
        if (checkoutStep === CHECKOUT_STEP.SHIPPING_METHOD) {
            setCheckoutStep(CHECKOUT_STEP.PAYMENT);
        }
    }, [checkoutStep]);

    const setPaymentInformationDone = useCallback(() => {
        if (checkoutStep === CHECKOUT_STEP.PAYMENT) {
            globalThis.scrollTo({
                left: 0,
                top: 0,
                behavior: 'smooth'
            });
            setCheckoutStep(CHECKOUT_STEP.REVIEW);
        }
    }, [checkoutStep]);

    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const handlePlaceOrder = useCallback(async () => {
        // Fetch order details and then use an effect to actually place the
        // order. If/when Apollo returns promises for invokers from useLazyQuery
        // we can just await this function and then perform the rest of order
        // placement.
        await getOrderDetails({
            variables: {
                cartId
            }
        });
        setPlaceOrderButtonClicked(true);
        setIsPlacingOrder(true);
        setNoProduct(false);
        ReactGA.event({
            category: 'Checkout page',
            action: 'Place order clicked',
            label: `Checkout page- Place order clicked`
        });
    }, [cartId, getOrderDetails, setNoProduct]);

    const [, { dispatch }] = useEventingContext();

    // Go back to checkout if shopper logs in
    useEffect(() => {
        if (isSignedIn) {
            setActiveContent('checkout');
        }
    }, [isSignedIn]);

    useEffect(() => {
        async function placeOrderAndCleanup() {
            try {
                const reCaptchaData = await generateReCaptchaData();
                const { cart } = orderDetailsData;
                const { data } = await runPlaceOrder({
                    variables: {
                        cartId
                    },
                    ...reCaptchaData
                });

                const orderId = data.placeOrder.order.order_number;

                ReactGA.plugin.execute('ecommerce', 'addTransaction', {
                    id: orderId,
                    revenue: cart.prices.subtotal_excluding_tax.value,
                    quantity: String(cart.total_quantity),
                    shipping: cart.shipping_addresses[0]?.selected_shipping_method?.amount.value,
                    tax: cart.prices.applied_taxes.reduce((acc, tax) => {
                        if (tax && tax?.amount) {
                            return acc + tax.amount.value;
                        }
                        return acc;
                    }, 0)
                });
                cart?.items.map(product => {
                    ReactGA.plugin.execute('ecommerce', 'addItem', {
                        id: orderId,
                        name: product.product.name,
                        sku: product.product.sku,
                        category: product.product.categories[0].name,
                        price: product.prices.price.value,
                        quantity: String(product.quantity)
                    });
                });

                ReactGA.plugin.execute('ecommerce', 'send');
                ReactGA.plugin.execute('ecommerce', 'clear');

                // Cleanup stale cart and customer info.
                await removeCart();
                await apolloClient.clearCacheData(apolloClient, 'cart');

                await createCart({
                    fetchCartId
                });
            } catch (err) {
                console.error('An error occurred during when placing the order', err);
                setPlaceOrderButtonClicked(false);
            }
        }

        if (orderDetailsData && isPlacingOrder) {
            setIsPlacingOrder(false);
            placeOrderAndCleanup();
        }
    }, [
        apolloClient,
        cartId,
        createCart,
        fetchCartId,
        generateReCaptchaData,
        orderDetailsData,
        runPlaceOrder,
        removeCart,
        isPlacingOrder
    ]);

    useEffect(() => {
        if (checkoutStep === CHECKOUT_STEP.SHIPPING_ADDRESS && cartItems.length) {
            dispatch({
                type: 'CHECKOUT_PAGE_VIEW',
                payload: {
                    cart_id: cartId,
                    products: cartItems
                }
            });
        } else if (reviewOrderButtonClicked) {
            dispatch({
                type: 'CHECKOUT_REVIEW_BUTTON_CLICKED',
                payload: {
                    cart_id: cartId
                }
            });
        } else if (placeOrderButtonClicked && orderDetailsData && orderDetailsData.cart) {
            const shipping =
                orderDetailsData.cart?.shipping_addresses &&
                orderDetailsData.cart.shipping_addresses.reduce((result, item) => {
                    return [
                        ...result,
                        {
                            ...item.selected_shipping_method
                        }
                    ];
                }, []);
            const eventPayload = {
                cart_id: cartId,
                amount: orderDetailsData.cart.prices,
                shipping: shipping,
                payment: orderDetailsData.cart.selected_payment_method,
                products: orderDetailsData.cart.items
            };
            if (isPlacingOrder) {
                dispatch({
                    type: 'CHECKOUT_PLACE_ORDER_BUTTON_CLICKED',
                    payload: eventPayload
                });
            } else if (placeOrderData && orderDetailsData?.cart.id === cartId) {
                dispatch({
                    type: 'ORDER_CONFIRMATION_PAGE_VIEW',
                    payload: {
                        order_number: placeOrderData.placeOrder.order.order_number,
                        ...eventPayload
                    }
                });
            }
        }
    }, [
        placeOrderButtonClicked,
        cartId,
        checkoutStep,
        orderDetailsData,
        cartItems,
        isLoading,
        dispatch,
        placeOrderData,
        isPlacingOrder,
        reviewOrderButtonClicked
    ]);

    return {
        activeContent,
        availablePaymentMethods: checkoutData ? checkoutData.cart?.available_payment_methods : null,
        cartItems,
        checkoutStep,
        customer,
        error: checkoutError,
        guestSignInUsername,
        handlePlaceOrder,
        handleBackToReview,
        hasError: !!checkoutError,
        isCartEmpty: !(checkoutData && checkoutData.cart?.total_quantity),
        isGuestCheckout: !isSignedIn,
        isLoading,
        isUpdating,
        orderDetailsData,
        orderDetailsLoading,
        orderNumber: (placeOrderData && placeOrderData.placeOrder.order.order_number) || null,
        placeOrderLoading,
        placeOrderButtonClicked,
        setCheckoutStep,
        setGuestSignInUsername,
        setIsUpdating,
        setShippingInformationDone,
        setShippingMethodDone,
        setPaymentInformationDone,
        scrollShippingInformationIntoView,
        shippingInformationRef,
        shippingMethodRef,
        scrollShippingMethodIntoView,
        resetReviewOrderButtonClicked,
        handleReviewOrder,
        reviewOrderButtonClicked,
        recaptchaWidgetProps,
        toggleAddressBookContent,
        toggleSignInContent,
        cartId,
        onBillingAddressChangedError,
        setCurrentSelectedPaymentMethod,
        onBillingAddressChangedSuccess,
        paymentMethodMutationData,
        currentSelectedPaymentMethod,
        resetEditing
    };
};
