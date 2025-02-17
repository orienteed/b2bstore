import { useState, useCallback, useMemo } from 'react';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

import { useStoreConfigContext } from '../../context/storeConfigProvider';

/**
 * @function
 * @param {number} props.numberOfWishlists - The current number of wishlists created
 *
 * @returns {CreateWishListProps}
 */
export const useCreateWishlist = (props = { numberOfWishlists: 1 }) => {
    const { numberOfWishlists } = props;

    const { createWishlist: createWishlistFromAdapter, getWishlists } = useAdapter();
    const { getWishlistsQuery } = getWishlists({ performQuery: false })

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [displayError, setDisplayError] = useState(false);

    const { createWishlist, error: createWishlistError, loading } = createWishlistFromAdapter();

    const { data: storeConfigData } = useStoreConfigContext();

    const shouldRender = useMemo(() => {
        return (
            (storeConfigData &&
                storeConfigData.storeConfig.enable_multiple_wishlists === '1' &&
                numberOfWishlists < storeConfigData.storeConfig.maximum_number_of_wishlists) ||
            false
        );
    }, [storeConfigData, numberOfWishlists]);

    const handleShowModal = useCallback(() => {
        setIsModalOpen(true);
        setDisplayError(false);
    }, []);

    const handleHideModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const handleCreateList = useCallback(
        async data => {
            // add private visibility because is required field
            if (data && !data.visibility) {
                data.visibility = 'PRIVATE';
            }

            try {
                await createWishlist({
                    variables: {
                        input: data
                    },
                    refetchQueries: [{ query: getWishlistsQuery }],
                    awaitRefetchQueries: true
                });
                setIsModalOpen(false);
            } catch (error) {
                setDisplayError(true);
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
            }
        },
        [createWishlist, setIsModalOpen, getWishlistsQuery]
    );

    const errors = useMemo(
        () => (displayError ? new Map([['createWishlistMutation', createWishlistError]]) : new Map()),
        [createWishlistError, displayError]
    );

    return {
        handleCreateList,
        handleHideModal,
        handleShowModal,
        isModalOpen,
        formErrors: errors,
        loading,
        shouldRender
    };
};

/**
 * JSDoc type definitions
 */

/**
 * Props data to use when rendering the Create Wishlist component.
 *
 * @typedef {Object} CreateWishListProps
 *
 * @property {Function} handleCreateList Callback to be called while creating new list
 * @property {Function} handleHideModal Callback to hide the create modal by modifying the value of isModalOpen
 * @property {Function} handleShowModal Callback to show the create modal by modifying the value of isModalOpen
 * @property {Boolean} isModalOpen Boolean which represents if the create modal is open or not
 */
