import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useCallback } from 'react';

export const useNavigationTrigger = () => {
	const [, { toggleDrawer }] = useAppContext();

	const handleOpenNavigation = useCallback(() => {
		toggleDrawer('nav');
	}, [toggleDrawer]);

	return {
		handleOpenNavigation
	};
};
