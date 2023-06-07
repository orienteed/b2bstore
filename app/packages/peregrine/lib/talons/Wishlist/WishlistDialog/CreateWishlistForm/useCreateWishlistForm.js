import { useCallback } from 'react';

import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

import { useFormState } from 'informed';

export const useCreateWishlistForm = props => {
    const { onCancel, onCreateList, isAddLoading } = props;

    const { createWishlist } = useAdapter();

    const { createList, loading: isCreateLoading, error: createWishlistError } = createWishlist();

    const { values } = useFormState();

    const handleCancel = useCallback(() => {
        onCancel();
    }, [onCancel]);

    const handleSave = useCallback(async () => {
        try {
            const visibility = values.visibility ? values.visibility : 'PRIVATE';

            const { data } = await createList({
                variables: {
                    input: {
                        name: values.listname,
                        visibility
                    }
                }
            });
            const wishlistId = data.createWishlist.wishlist.id;

            onCreateList(wishlistId);
        } catch (err) {
            console.log(err);
        }
    }, [createList, onCreateList, values]);

    return {
        formErrors: [createWishlistError],
        handleCancel,
        handleSave,
        isSaveDisabled: isCreateLoading || isAddLoading
    };
};
