import { gql } from '@apollo/client';

export const CREATE_ACCOUNT = gql`
	mutation CreateAccountAfterCheckout(
		$email: String!
		$firstname: String!
		$lastname: String!
		$password: String!
		$is_subscribed: Boolean!
	) {
		createCustomer(
			input: {
				email: $email
				firstname: $firstname
				lastname: $lastname
				password: $password
				is_subscribed: $is_subscribed
			}
		) {
			# The createCustomer mutation returns a non-nullable CustomerOutput type
			# which requires that at least one of the sub fields be returned.

			customer {
				email
			}
		}
	}
`;

export const GET_CUSTOMER = gql`
	query GetCustomerAfterCheckout {
		customer {
			email
			firstname
			lastname
			is_subscribed
		}
	}
`;

export const SIGN_IN = gql`
	mutation SignInAfterCheckout($email: String!, $password: String!) {
		generateCustomerToken(email: $email, password: $password) {
			token
		}
	}
`;

export const CREATE_CART = gql`
	mutation CreateCartAfterCheckout {
		cartId: createEmptyCart
	}
`;

export const GET_CART_DETAILS = gql`
	query GetCartDetailsAfterCheckout($cartId: String!) {
		cart(cart_id: $cartId) {
			id

			items {
				uid
				prices {
					price {
						value
					}
				}

				product {
					uid
					name
					sku
					small_image {
						url
						label
					}
					price {
						regularPrice {
							amount {
								value
							}
						}
					}
				}
				quantity

				... on ConfigurableCartItem {
					configurable_options {
						configurable_product_option_uid
						option_label
						configurable_product_option_value_uid
						value_label
					}
				}
			}
			prices {
				grand_total {
					value
					currency
				}
			}
		}
	}
`;

export default {
	createAccountMutation: CREATE_ACCOUNT,
	createCartMutation: CREATE_CART,
	getCartDetailsQuery: GET_CART_DETAILS,
	getCustomerQuery: GET_CUSTOMER,
	signInMutation: SIGN_IN
};
