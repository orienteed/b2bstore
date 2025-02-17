import React, { Fragment, Suspense } from 'react';
import { shape, string } from 'prop-types';
import { Link, Route } from 'react-router-dom';

import Logo from '../Logo';
import AccountTrigger from './accountTrigger';
import CartTrigger from './cartTrigger';
import NavTrigger from './navTrigger';
import SearchTrigger from './searchTrigger';
import OnlineIndicator from './onlineIndicator';
import QuickOrderForm from '../QuickOrderForm';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useHeader } from '@magento/peregrine/lib/talons/Header/useHeader';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import { useStyle } from '../../classify';
import defaultClasses from './header.module.css';
import StoreSwitcher from './storeSwitcher';
import CurrencySwitcher from './currencySwitcher';
import MegaMenu from '../MegaMenu';
import PageLoadingIndicator from '../PageLoadingIndicator';
import { useIntl } from 'react-intl';

import useCompareProduct from '@magento/peregrine/lib/talons/ComparePage/useCompareProduct';
import CompareIcon from '@magento/venia-ui/lib/assets/compare.svg';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

const SearchBar = React.lazy(() => import('../SearchBar'));

const Header = props => {
    const {
        handleSearchTriggerClick,
        hasBeenOffline,
        isOnline,
        isSearchOpen,
        searchRef,
        searchTriggerRef
    } = useHeader();
    const classes = useStyle(defaultClasses, props.classes);
    const rootClass = isSearchOpen ? classes.open : classes.closed;
    const storage = new BrowserPersistence();
    const [{ isSignedIn }] = useUserContext();
    const { productsCount } = useCompareProduct();
    const storeConfigRequiredLogin = storage.getItem('is_required_login');
    const isRequiredLogin = storeConfigRequiredLogin === '1';

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
                    {(!isRequiredLogin || (isRequiredLogin && isSignedIn)) && <MegaMenu />}
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
                        <div className={classes.quickOrderContainer}>{isSignedIn && <QuickOrderForm  handleClose={()=> {}} />}</div>
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
