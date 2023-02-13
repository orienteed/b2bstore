import { ApolloProvider } from '@apollo/client';
import { useAdapter } from '@magento/peregrine/lib/talons/Adapter/useAdapter';
import App, { AppContextProvider } from '@magento/venia-ui/lib/components/App';
import StoreCodeRoute from '@magento/venia-ui/lib/components/StoreCodeRoute';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

const Adapter = props => {
	const talonProps = useAdapter(props);
	const { apolloProps, initialized, reduxProps, routerProps, urlHasStoreCode } = talonProps;

	// TODO: Replace with app skeleton. See PWA-547.
	if (!initialized) {
		return null;
	}

	const children = props.children || <App />;
	const storeCodeRouteHandler = urlHasStoreCode ? <StoreCodeRoute /> : null;

	return (
		<ApolloProvider {...apolloProps}>
			<ReduxProvider {...reduxProps}>
				<BrowserRouter {...routerProps}>
					{storeCodeRouteHandler}
					<AppContextProvider>{children}</AppContextProvider>
				</BrowserRouter>
			</ReduxProvider>
		</ApolloProvider>
	);
};

export default Adapter;
