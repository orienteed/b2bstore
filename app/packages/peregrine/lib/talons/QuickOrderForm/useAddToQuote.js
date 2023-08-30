/* eslint-disable no-unused-vars */
import React, { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { useToasts } from '@magento/peregrine';
import { AFTER_UPDATE_MY_QUOTE } from '../RequestQuote/useQuoteCartTrigger';
import { setQuoteId } from '../RequestQuote/Store';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

export const useAddToQuote = () => {
    const { formatMessage } = useIntl();

    const {
        addConfigurableProductsToQuote,
        addSimpleProductsToQuote,
        submitCurrentQuote: submitCurrentQuoteFromAdapter
    } = useAdapter();

    const [, { addToast }] = useToasts();
    const [isLoading, setIsLoading] = useState(false);
    const { addSimpleProductToQuote } = addSimpleProductsToQuote();
    const { submitCurrentQuote } = submitCurrentQuoteFromAdapter();
    const { addConfigProductToQuote } = addConfigurableProductsToQuote();

    // Add Simple Product
    const handleAddItemBySku = useCallback(
        async items => {
            setIsLoading(true);
            const variables = {
                input: {
                    cart_items: items.map(ele => {
                        return {
                            data: {
                                sku: ele.sku,
                                quantity: ele.quantity || 1
                            }
                        };
                    })
                }
            };

            const {
                data: {
                    addSimpleProductsToMpQuote: { quote }
                }
            } = await addSimpleProductToQuote({
                variables
            });
            const {
                data: { mpQuoteSubmit }
            } = await submitCurrentQuote();
            await setQuoteId(quote.entity_id);
            await window.dispatchEvent(new CustomEvent(AFTER_UPDATE_MY_QUOTE, { detail: quote }));
            setTimeout(() => setIsLoading(false), 1000);

            addToast({
                type: 'success',
                message: formatMessage(
                    {
                        id: 'quickOrder.addToQuote',
                        defaultMessage:
                            'Quote #{id} submitted successfully! Total: {total} {currency}. Items: {items}. Customer Email: {email}. Thank you!'
                    },
                    {
                        id: 'quote.entity_id',
                        total: 'quote.subtotal',
                        currency: 'quote.entity_id',
                        items: 'quote.items_count',
                        email: 'quote.customer_email'
                    }
                ),
                timeout: 5000
            });
        },
        [addSimpleProductToQuote, addToast, formatMessage, submitCurrentQuote]
    );

    const handleAddCofigItemBySku = useCallback(
        async items => {
            setIsLoading(true);
            const variables = {
                input: {
                    cart_items: items.map(ele => {
                        return {
                            data: {
                                sku: ele.sku,
                                quantity: ele.quantity || 1
                            },
                            parent_sku: ele.orParentSku
                        };
                    })
                }
            };

            const {
                data: {
                    addConfigurableProductsToMpQuote: { quote }
                }
            } = await addConfigProductToQuote({
                variables
            });
            const {
                data: { mpQuoteSubmit }
            } = await submitCurrentQuote();
            await setQuoteId(quote.entity_id);
            await window.dispatchEvent(new CustomEvent(AFTER_UPDATE_MY_QUOTE, { detail: quote }));
            setTimeout(() => setIsLoading(false), 1000);
            addToast({
                type: 'success',
                message: formatMessage(
                    {
                        id: 'quickOrder.addToQuote',
                        defaultMessage:
                            'Quote #{id} submitted successfully! Total: {total} {currency}. Items: {items}. Customer Email: {email}. Thank you!'
                    },
                    {
                        id: quote.entity_id,
                        total: quote.subtotal,
                        currency: quote.quote_currency_code,
                        items: quote.items_count,
                        email: quote.customer_email
                    }
                ),
                timeout: 8000
            });
        },
        [addConfigProductToQuote, formatMessage, addToast, submitCurrentQuote]
    );
    return { handleAddItemBySku, handleAddCofigItemBySku, isLoading };
};
