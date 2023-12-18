import { useCallback } from 'react';
import { useCartContext } from '@magento/peregrine/lib/context/cart';


//This is the class that calls the resolver to apply gift to cart with corresponding parameters.
export const useGiftCertificate = props => {
    const { applyGiftCardToCartFromAdapter } = props;

    //cart id and checkout id are the same
    const [{ cartId }] = useCartContext();

    const { applyGiftCardToCart } = applyGiftCardToCartFromAdapter();
    //See https://developer.bigcommerce.com/docs/rest-storefront/checkouts/checkout-gift-certificates
    const useGift = useCallback(
        async formValues => {
            const variables = {
                cartId,
                //Ensure you use a valid and active gift certificate code
                giftCardCode: "2LI-615-46W-YGG"
            };
            try {
                await applyGiftCardToCart({
                    variables
                });
            } catch {
                return;
            }
        },
        [
            applyGiftCardToCart,
            cartId
        ]
    );

    return {
        useGift
    };
};