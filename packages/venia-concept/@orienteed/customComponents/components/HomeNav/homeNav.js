import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './homeNav.module.css';
import { ChevronDown as ArrowDown } from 'react-feather';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { Link } from 'react-router-dom';
import { Star as StarIcon } from 'react-feather';
import CompareIcon from './Icon/compare.svg';
import CartIcon from './Icon/cart.svg';
const HomeNav = () => {
    const classes = useStyle(defaultClasses);
    const arrowIcon = <Icon className={classes.arrowDown} src={ArrowDown} size={16} />;
    return (
        <div className={classes.navWrap}>
            <div className={classes.container}>
                <div className={classes.grid}>
                    <div className={classes.navItem}>
                        <Link to="/" className={classes.navLink}>
                            Home & Garden {arrowIcon}
                        </Link>
                    </div>
                    <div className={classes.navItem}>
                        <Link to="/" className={classes.navLink}>
                            Motors {arrowIcon}
                        </Link>
                    </div>
                    <div className={classes.navItem}>
                        <Link to="/" className={classes.navLink}>
                            Electronics
                        </Link>
                    </div>
                    <div className={classes.navItem}>
                        <Link to="/" className={classes.navLink}>
                            Office Equipment
                        </Link>
                    </div>
                    <div className={[classes.navItem, classes.leftNavItem].join(' ')}>
                        <div className={classes.iconWraper}>
                            <img src={CompareIcon} />
                            <div className={classes.textImg}>4</div>
                        </div>
                        Compare
                    </div>
                    <div className={[classes.navItem, classes.leftNavItem].join(' ')}>
                        <div className={classes.iconWraper}>
                            <Icon src={StarIcon} size={16} />
                            <div className={classes.textImg}>9</div>
                        </div>
                        Favorites
                    </div>
                    <div className={[classes.navItem, classes.leftNavItem].join(' ')}>
                        <div className={classes.iconWraper}>
                            <img src={CartIcon} alt="cart" />
                            <div className={classes.textImg}>26</div>
                        </div>
                        Cart
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeNav;
