import { useActionMenu } from '@magento/peregrine/lib/talons/WishlistPage/useActionMenu';
import React from 'react';
import { MoreHorizontal } from 'react-feather';

import Icon from '../Icon';
import WishlistEditFavoritesListDialog from './wishlistEditFavoritesListDialog';
import WishlistListActionsDialog from './wishlistListActionsDialog';

const ActionMenu = props => {
	const { id, name, visibility } = props;
	const talonProps = useActionMenu({ id });
	const {
		editFavoritesListIsOpen,
		formErrors,
		handleActionMenuClick,
		handleEditWishlist,
		handleHideDialogs,
		handleShowEditFavorites,
		isEditInProgress,
		listActionsIsOpen,
		shouldRender
	} = talonProps;

	if (!shouldRender) {
		return null;
	}

	return (
		<div>
			<button onClick={handleActionMenuClick} type="button">
				<Icon src={MoreHorizontal} size={24} />
			</button>
			<WishlistListActionsDialog
				isOpen={listActionsIsOpen}
				onCancel={handleHideDialogs}
				onEdit={handleShowEditFavorites}
			/>
			<WishlistEditFavoritesListDialog
				formErrors={formErrors}
				formProps={{
					initialValues: {
						name: name,
						visibility: visibility
					}
				}}
				isOpen={editFavoritesListIsOpen}
				isEditInProgress={isEditInProgress}
				onCancel={handleHideDialogs}
				onConfirm={handleEditWishlist}
			/>
		</div>
	);
};

export default ActionMenu;
