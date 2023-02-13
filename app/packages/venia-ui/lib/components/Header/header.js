import { useUserContext } from '@magento/peregrine/lib/context/user';
import useCompareProduct from '@magento/peregrine/lib/talons/ComparePage/useCompareProduct';
import { useHeader } from '@magento/peregrine/lib/talons/Header/useHeader';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { shape, string } from 'prop-types';
import React, { Fragment, Suspense } from 'react';
import { useIntl } from 'react-intl';
import { Link, Route } from 'react-router-dom';

import { useStyle } from '../../classify';
import Logo from '../Logo';
import MegaMenu from '../MegaMenu';
import PageLoadingIndicator from '../PageLoadingIndicator';
import QuickOrderForm from '../QuickOrderForm';
import AccountTrigger from './accountTrigger';
import CartTrigger from './cartTrigger';
import CurrencySwitcher from './currencySwitcher';
import defaultClasses from './header.module.css';
import CompareIcon from './icons/compare.svg';
import NavTrigger from './navTrigger';
import OnlineIndicator from './onlineIndicator';
import SearchTrigger from './searchTrigger';
import StoreSwitcher from './storeSwitcher';

const SearchBar = React.lazy(() => import('../SearchBar'));

const Header = props => {
	const { handleSearchTriggerClick, hasBeenOffline, isOnline, isSearchOpen, searchRef, searchTriggerRef } =
		useHeader();
	const classes = useStyle(defaultClasses, props.classes);
	const rootClass = isSearchOpen ? classes.open : classes.closed;

	const [{ isSignedIn }] = useUserContext();
	const { productsCount } = useCompareProduct();

	const searchBarFallback = (
		<div className={classes.searchFallback} ref={searchRef}>
			<div className={classes.input}>
				<div className={classes.loader}>
					<div className={classes.loaderBefore} />
					<div className={classes.loaderAfter} />
				</div>
			</div>
		</div>
	);
	const searchBar = isSearchOpen ? (
		<Suspense fallback={searchBarFallback}>
			<Route>
				<SearchBar isOpen={isSearchOpen} ref={searchRef} />
			</Route>
		</Suspense>
	) : null;

	const { formatMessage } = useIntl();
	const title = formatMessage({ id: 'logo.title', defaultMessage: 'B2BStore' });

	return (
		<Fragment>
			<div className={classes.switchersContainer}>
				<div className={classes.switchers} data-cy="Header-switchers">
					<StoreSwitcher />
					<CurrencySwitcher />
				</div>
			</div>
			<header className={rootClass} data-cy="Header-root">
				<div className={classes.toolbar}>
					<div className={classes.primaryActions}>
						<NavTrigger />
					</div>
					<OnlineIndicator hasBeenOffline={hasBeenOffline} isOnline={isOnline} />
					<Link
						aria-label={title}
						to={resourceUrl('/')}
						className={classes.logoContainer}
						data-cy="Header-logoContainer"
					>
						<Logo classes={{ logo: classes.logo }} />
					</Link>
					<MegaMenu />
					<div className={classes.secondaryActions}>
						<SearchTrigger onClick={handleSearchTriggerClick} ref={searchTriggerRef} />
						<AccountTrigger />
						<CartTrigger />
						{isSignedIn && productsCount > 0 && (
							<Link className={classes.compareLink} to="/compare_products">
								<span className={classes.productsCount}>{productsCount}</span>
								<img src={CompareIcon} alt=" compare Icon" />
							</Link>
						)}
						<div className={classes.quickOrderContainer}>{isSignedIn && <QuickOrderForm />}</div>
					</div>
				</div>
				{searchBar}
				<PageLoadingIndicator absolute />
			</header>
		</Fragment>
	);
};

Header.propTypes = {
	classes: shape({
		closed: string,
		logo: string,
		open: string,
		primaryActions: string,
		secondaryActions: string,
		toolbar: string,
		switchers: string,
		switchersContainer: string
	})
};

export default Header;
