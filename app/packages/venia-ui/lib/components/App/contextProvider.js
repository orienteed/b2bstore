import React from 'react';
import {
    PeregrineContextProvider as Peregrine,
    ToastContextProvider,
    WindowSizeContextProvider
} from '@magento/peregrine';
import LocaleProvider from './localeProvider';
import { NoReorderProductProvider } from '../NoReorderProductProvider/noReorderProductProvider';

/**
 * List of context providers that are required to run Venia
 *
 * @property {React.Component[]} contextProviders
 */
const contextProviders = [LocaleProvider, Peregrine, WindowSizeContextProvider, ToastContextProvider];

const ContextProvider = ({ children }) => {
    return contextProviders.reduceRight((memo, ContextProvider) => {
        return (
            <NoReorderProductProvider>
                <ContextProvider>{memo}</ContextProvider>
            </NoReorderProductProvider>
        );
    }, children);
};

export default ContextProvider;
