import React from 'react';

import defaultClasses from './sideMenu.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { FormattedMessage } from 'react-intl';
import { useHistory, Link } from 'react-router-dom';

const SideMenu = () => {
    const history = useHistory();
    const { location } = history;
    const classes = useStyle(defaultClasses);
    const isPageActive = link => link == location.pathname;
    return (
        <div className={classes.container}>
            <div
                className={`${classes.menuItem} ${isPageActive('/company-account/information') && classes.activeItem}`}
            >
                <Link to="/company-account/information">
                    <span>
                        <FormattedMessage id={'companyAccount.myCompany'} defaultMessage="My Company" />
                    </span>
                </Link>
            </div>
            <div className={`${classes.menuItem} ${isPageActive('/company-account/users') && classes.activeItem}`}>
                <Link to="/company-account/users">
                    <span>
                        <FormattedMessage id={'companyAccount.users'} defaultMessage="Users" />
                    </span>
                </Link>
            </div>
            <div className={`${classes.menuItem} ${isPageActive('/company-account/orders') && classes.activeItem}`}>
                <Link to="/company-account/orders">
                    <span>
                        <FormattedMessage id={'companyAccount.orders'} defaultMessage="Orders" />
                    </span>
                </Link>
            </div>
            <div className={`${classes.menuItem} ${isPageActive('/company-account/userRoles') && classes.activeItem}`}>
                <Link to="/company-account/userRoles">
                    <span>
                        <FormattedMessage id={'companyAccount.userRoles'} defaultMessage="User Roles" />
                    </span>
                </Link>
            </div>
        </div>
    );
};

export default SideMenu;
