import { gql } from '@apollo/client';

export const SAVE_CART = gql`
    mutation getOrienteedSaveCart($cartId: String!, $cartName: String!, $description: String) {
        orienteedSaveCart(cart_id: $cartId, cart_name: $cartName, description: $description)
    }
`;

export const CREATE_CART = gql`
    # This mutation will return a masked cart id. If a bearer token is provided for
    # a logged in user it will return the cart id for that user.
    mutation createCart {
        cartId: createEmptyCart
    }
`;

export const MP_SAVE_CART_CONFIG = gql`
    # This mutation will return a masked cart id. If a bearer token is provided for
    # a logged in user it will return the cart id for that user.
    query orienteedSaveCartConfigs {
        orienteedSaveCartConfigs {
            button_title
            enabled
            show_button_guest
        }
    }
`;
