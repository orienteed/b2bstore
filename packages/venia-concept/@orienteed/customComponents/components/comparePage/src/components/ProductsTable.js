import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import ProductsList from './ProductCard';
import RichText from '@magento/venia-ui/lib/components/RichText';
import defaultClasses from './ProductsTable.module.css';
const ProductsTable = ({ productsItems }) => {
    const classes = useStyle(defaultClasses);
    return (
        <div className={classes.tableWrapper}>
            <table className={classes.productTable}>
                <caption className={classes.tableCaption}>Compare Products</caption>
                <thead>
                    <tr>
                        <th className={classes.cell} scope="row">
                            <span> </span>
                        </th>
                        {productsItems.map(item => (
                            <td key={item.sku + 'thead'} className={classes.cell} />
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row" className={`${classes.cell} ${classes.label}`}>
                            <span>Product</span>
                        </th>
                        {productsItems.map(item => (
                            <td
                                key={item.sku + 'tbody1'}
                                className={`${classes.cell} ${classes.info} ${classes.product}`}
                            >
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
                            <td key={sku + 'tbody2'} className={`${classes.cell} ${classes.info} ${classes.product}`}>
                                <span>{sku}</span>
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <th className={`${classes.cell} ${classes.label} `}>
                            <span>Description</span>
                        </th>
                        {productsItems.map(({ description,sku }) => (
                            <td key={sku + 'tbody3'} className={`${classes.cell} ${classes.info} ${classes.product}`}>
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
};

export default ProductsTable;
