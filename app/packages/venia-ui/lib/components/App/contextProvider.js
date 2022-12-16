import React from 'react';
import {
    PeregrineContextProvider as Peregrine,
    ToastContextProvider,
    WindowSizeContextProvider
} from '@magento/peregrine';
import LocaleProvider from './localeProvider';
import { NoReorderProductProvider } from '../NoReorderProductProvider/noReorderProductProvider';
import { DownloadCsvProvider } from '../Gallery/DownloadCsvProvider/downloadCsvProvider';
import { PrintPdfProvider } from '../CartPage/PrintPdfProvider/printPdfProvider';
import { RMAFormProvider } from '../RMA/RMAForm/RMAFormProvider/RMAFormProvider';
/**
 * List of context providers that are required to run Venia
 *
 * @property {React.Component[]} contextProviders
 */
const contextProviders = [LocaleProvider, Peregrine, WindowSizeContextProvider, ToastContextProvider];

const ContextProvider = ({ children }) => {
    return contextProviders.reduceRight((memo, ContextProvider) => {
        return (
            <RMAFormProvider>
                <PrintPdfProvider>
                    <DownloadCsvProvider>
                        <NoReorderProductProvider>
                            <ContextProvider>{memo}</ContextProvider>
                        </NoReorderProductProvider>
                    </DownloadCsvProvider>
                </PrintPdfProvider>
            </RMAFormProvider>
        );
    }, children);
};

export default ContextProvider;
