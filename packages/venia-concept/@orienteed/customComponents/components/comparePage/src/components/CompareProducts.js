import React, { useMemo } from 'react';
import useCompareProduct from '@orienteed/customComponents/components/comparePage/src/talons/useCompareProduct';
import { FormattedMessage } from 'react-intl';
import { useStyle } from '@magento/venia-ui/lib/classify';

import ProductsList from './ProductsList';
import defaultClasses from './compareProducts.module.css'
const CompareProducts = () => {
    const talonProps = useCompareProduct();
    const { productsItems } = talonProps;
    const classes = useStyle(defaultClasses);
    console.log(productsItems, 'productsItemsproductsItems');

    const productsElements = useMemo(() => {
        if (productsItems.length === 0) {
            return <ProductsList />;
        }

        return productsItems.map((item, index) => <ProductsList key={item.id} data={item} />);
    }, [productsItems]);
    return (
        <div className={classes.root} data-cy="Wishlist-root">
            <h1 className={classes.heading} data-cy="WishlistPage-heading">
                <FormattedMessage
                    id={'wishlistPage.headingText'}
                    defaultMessage={'{count, plural, one {Favorites List} other {Favorites Lists}}'}
                />
            </h1>
            {productsElements}
        </div>
    );
};

export default CompareProducts;
