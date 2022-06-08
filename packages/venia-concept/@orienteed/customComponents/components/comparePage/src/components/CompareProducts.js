import React, { useMemo } from 'react';
import useCompareProduct from '@orienteed/customComponents/components/comparePage/src/talons/useCompareProduct';
import { FormattedMessage } from 'react-intl';
import { useStyle } from '@magento/venia-ui/lib/classify';

import ProductsList from './ProductsList';
import defaultClasses from './compareProducts.module.css';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import RichText from '@magento/venia-ui/lib/components/RichText';
const CompareProducts = () => {
    const talonProps = useCompareProduct();
    const { productsItems, isLoading } = talonProps;
    const classes = useStyle(defaultClasses);
    console.log(productsItems, 'productsItemsproductsItems');

    const productsElements = useMemo(() => {
        if (isLoading) {
            return <LoadingIndicator />;
        } else {
            if (productsItems.length === 0) {
                return;
            }
            return (
                <div className={classes.tableWrapper}>
                    <table className={classes.productTable}>
                        <caption className={classes.tableCaption}>Compare Products</caption>
                        <thead>
                            <tr>
                                <th className={classes.cell} scope="row">
                                    <span> </span>
                                </th>
                                {productsItems.map((item, index) => (
                                    <td className={classes.cell} />
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row" className={`${classes.cell} ${classes.label}`}>
                                    <span>Product</span>
                                </th>
                                {productsItems.map((item, index) => (
                                    <td className={`${classes.cell} ${classes.info} ${classes.product}`}>
                                        <ProductsList key={item.id} item={item} />
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <th scope="row" className={`${classes.cell} ${classes.label} `}>
                                    <span>SKU</span>
                                </th>
                                {productsItems.map(({ sku }) => (
                                    <td className={`${classes.cell} ${classes.info} ${classes.product}`}>
                                        <span>{sku}</span>
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <th className={`${classes.cell} ${classes.label} `}>
                                    <span>Description</span>
                                </th>
                                {productsItems.map(({ description }) => (
                                    <td className={`${classes.cell} ${classes.info} ${classes.product}`}>
                                        <span>
                                            {' '}
                                            <RichText content={description.html} />
                                        </span>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        }
    }, [productsItems]);
    return (
        <div className={classes.root} data-cy="CompareProducts-root">
            <h1 className={classes.heading} data-cy="CompareProductsPage-heading">
                <FormattedMessage id={'compareProductsPage.headingText'} defaultMessage="Compare Products" />
            </h1>
            <div className={classes.productsWrapper} data-cy="compare-products-root">
                <div className={classes.header}>
                    <h2 className={classes.name} data-cy="compare-products-name">
                        <FormattedMessage id={'compareProductsPage.headingText'} defaultMessage="Compare Products" />
                    </h2>
                    <div className={classes.name}>{productsItems.length} items in this list</div>
                </div>
                <div> {productsElements} </div>
            </div>
            {/* {productsElements} */}
        </div>
    );
};

export default CompareProducts;
