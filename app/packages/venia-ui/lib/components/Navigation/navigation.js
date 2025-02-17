import React, { Suspense, useEffect } from 'react';
import { shape, string } from 'prop-types';
import { useNavigation } from '@magento/peregrine/lib/talons/Navigation/useNavigation';
import { Link } from 'react-router-dom';

import { useStyle } from '../../classify';
import AuthBar from '../AuthBar';
import CategoryTree from '../CategoryTree';
import CurrencySwitcher from '../Header/currencySwitcher';
import StoreSwitcher from '../Header/storeSwitcher';
import LoadingIndicator from '../LoadingIndicator';
import NavHeader from './navHeader';
import defaultClasses from './navigation.module.css';
import { FocusScope } from 'react-aria';
import { Portal } from '../Portal';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import QuickOrderForm from '../QuickOrderForm';
import useCompareProduct from '@magento/peregrine/lib/talons/ComparePage/useCompareProduct';
import CompareIcon from '../../assets/compare.svg';
const AuthModal = React.lazy(() => import('../AuthModal'));

const Navigation = props => {
    const {
        catalogActions,
        categoryId,
        handleBack,
        handleClose,
        hasModal,
        isOpen,
        isTopLevel,
        setCategoryId,
        showCreateAccount,
        showForgotPassword,
        showMainMenu,
        showMyAccount,
        showSignIn,
        view
    } = useNavigation();

    const { productsCount } = useCompareProduct();

    useEffect(() => {
        document.body.classList.toggle(classes.asideOpen, isOpen);
    }, [isOpen]);
    const classes = useStyle(defaultClasses, props.classes);
    const rootClassName = isOpen ? classes.root_open : classes.root;
    const modalClassName = hasModal ? classes.modal_open : classes.modal;
    const bodyClassName = hasModal ? classes.body_masked : classes.body;
    const tabIndex = isOpen ? '0' : '-1';
    const [{ isSignedIn }] = useUserContext();

    // Lazy load the auth modal because it may not be needed.
    const authModal = hasModal ? (
        <Suspense fallback={<LoadingIndicator />}>
            <AuthModal
                closeDrawer={handleClose}
                showCreateAccount={showCreateAccount}
                showForgotPassword={showForgotPassword}
                showMainMenu={showMainMenu}
                showMyAccount={showMyAccount}
                showSignIn={showSignIn}
                view={view}
            />
        </Suspense>
    ) : null;

    return (
        <Portal>
            {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
            <FocusScope contain={isOpen} restoreFocus autoFocus>
                {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
                <aside className={rootClassName}>
                    <header className={classes.header}>
                        <NavHeader isTopLevel={isTopLevel} onBack={handleBack} view={view} />
                    </header>
                    <div className={bodyClassName}>
                        <CategoryTree
                            categoryId={categoryId}
                            onNavigate={handleClose}
                            setCategoryId={setCategoryId}
                            updateCategories={catalogActions.updateCategories}
                            tabIndex={tabIndex}
                        />
                    </div>
                    <div className={classes.footer}>
                        <div className={classes.actionsContainer}>
                            {isSignedIn && productsCount > 0 && (
                                <Link className={classes.compareLink} onClick={handleClose} to="/compare_products">
                                    <span className={classes.productsCount}>{productsCount}</span>
                                    <img src={CompareIcon} alt=" compare Icon" />
                                </Link>
                            )}
                            <div className={classes.quickOrderContainer}>{isSignedIn && <QuickOrderForm handleClose={handleClose} />}</div>
                        </div>
                        <div className={classes.switchers}>
                            <StoreSwitcher />
                            <CurrencySwitcher />
                        </div>

                        <AuthBar disabled={hasModal} showMyAccount={showMyAccount} showSignIn={showSignIn} />
                    </div>
                    <div className={modalClassName}>{authModal}</div>
                </aside>
            </FocusScope>
        </Portal>
    );
};

export default Navigation;

Navigation.propTypes = {
    classes: shape({
        body: string,
        form_closed: string,
        form_open: string,
        footer: string,
        header: string,
        root: string,
        root_open: string,
        signIn_closed: string,
        signIn_open: string
    })
};
