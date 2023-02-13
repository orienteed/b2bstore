import {
	PeregrineContextProvider as Peregrine,
	ToastContextProvider,
	WindowSizeContextProvider
} from '@magento/peregrine';
import React from 'react';

import { PrintPdfProvider } from '../CartPage/PrintPdfProvider/printPdfProvider';
import { DownloadCsvProvider } from '../Gallery/DownloadCsvProvider/downloadCsvProvider';
import { NoReorderProductProvider } from '../NoReorderProductProvider/noReorderProductProvider';
import LocaleProvider from './localeProvider';
/**
 * List of context providers that are required to run Venia
 *
 * @property {React.Component[]} contextProviders
 */
const contextProviders = [LocaleProvider, Peregrine, WindowSizeContextProvider, ToastContextProvider];

const ContextProvider = ({ children }) => {
	return contextProviders.reduceRight((memo, ContextProvider) => {
		return (
			<PrintPdfProvider>
				<DownloadCsvProvider>
					<NoReorderProductProvider>
						<ContextProvider>{memo}</ContextProvider>
					</NoReorderProductProvider>
				</DownloadCsvProvider>
			</PrintPdfProvider>
		);
	}, children);
};

export default ContextProvider;
