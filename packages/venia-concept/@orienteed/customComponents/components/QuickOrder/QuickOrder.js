import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Button from '@magento/venia-ui/lib/components/Button';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './QuickOrder.module.css';
import { Download, PlusCircle, ArrowDown, XCircle } from 'react-feather';
import Dialog from '@magento/venia-ui/lib/components/Dialog/dialog';
import { useAddProductsByCSV } from '../../talons/useAddProductsByCSV';
import SearchBar from '@magento/venia-ui/lib/components/SearchBar';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { CSVLink } from 'react-csv';
import { QuantityFields } from '@magento/venia-ui/lib/components/CartPage/ProductListing/quantity';
import { useHistory } from 'react-router-dom';
import { useToasts } from '@magento/peregrine';
import shop1 from './Icons/shop1.svg';

let iniArray = [{ name: '', quantity: 1 }];

const AddQuickOrder = props => {
    const [, { addToast }] = useToasts();
    const { push } = useHistory();
    const [isOpen, setIsOpen] = useState(false);
    const [products, setProducts] = useState(JSON.parse(JSON.stringify(iniArray)));
    const [csvData, setCsvData] = useState([]);
    const classes = mergeClasses(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const success = () => {
        displayMessage('success', 'Added to cart successfully');
        setIsOpen(false);
        setProducts(JSON.parse(JSON.stringify(iniArray)));
    };
    const { handleAddProductsToCart, handleCSVFile } = useAddProductsByCSV({
        quickOrder: true,
        setCsvErrorType: () => displayMessage('warning', 'something went wrong, try again later'),
        setCsvSkuErrorList: () => displayMessage('warning', 'something went wrong with SKU, try again later'),
        setIsCsvDialogOpen: () => {},
        setProducts,
        success
    });

    const displayMessage = (type, message, time = 5000) => {
        addToast({
            type: type,
            message,
            timeout: time
        });
    };
    useEffect(() => {
        downloadCsv();
    }, [products]);
    const onOrderClick = () => {
        setIsOpen(!isOpen);
        setProducts(JSON.parse(JSON.stringify(iniArray)));
    };
    const handleSearchClick = (product, index) => {
        let newProducts = [...products];

        newProducts[index] = product;
        newProducts[index] = {
            ...newProducts[index],
            quantity: 1
        };
        setProducts([...newProducts, { name: '' }]);
    };
    const handleChangeText = (e, key) => {
        let newProducts = [...products];
        newProducts[key].name = e;
        newProducts[key].price && delete newProducts[key].price;
        setProducts(newProducts);
    };
    const onChangeQty = (value, index) => {
        let newProducts = [...products];
        newProducts[index] = {
            ...newProducts[index],
            quantity: value
        };
        setProducts(newProducts);
    };

    const formatData = data => {
        let dataValidated = [];
        let productArr = [...data];
        for (let i = 0; i < productArr.length; i++) {
            if (Object.keys(productArr[i]).length > 0 && productArr[i].sku) {
                dataValidated.push([productArr[i].sku, productArr[i].quantity]);
            }
        }
        return dataValidated;
    };
    const addToCartClick = () => {
        let dataValidated = formatData(products);
        handleAddProductsToCart(dataValidated);
    };
    const addQuoteClick = () => {
        displayMessage('warning', 'something went wrong, try again later');
        //TODO => we are still wating to migrate this feature from the template to b2bstore
    };
    const downloadCsv = () => {
        let newArr = [...products];
        let newData = [];
        newArr.map(item => {
            if (item.name) {
                const { sku, quantity } = item;
                newData.push({
                    sku,
                    quantity
                });
            }
        });
        setCsvData(newData);
    };
    const createOrderClick = () => {
        addToCartClick();
        push('/checkout');
        setIsOpen(false);
        setProducts(JSON.parse(JSON.stringify(iniArray)));
    };
    const addProduct = () => {
        setProducts([...products, {}]);
    };
    const removeProduct = key => {
        let newProducts = JSON.parse(JSON.stringify(products)).filter((ele, index) => index !== key);
        setProducts([...newProducts]);
    };
    const quantitySelector = (item, id) => (
        <div className={classes.inputQtyQuick}>
            <QuantityFields
                fieldName={`${item.sku}-${id}`}
                min={1}
                quickOrder={true}
                hideButtons
                onChange={e => onChangeQty(e, id)}
            />
        </div>
    );
    return (
        <>
            <div className={classes.btnOrderContainer}>
                <Button priority="high" className={`${classes.orderIcon} ${classes.gridBtn}`} onClick={onOrderClick}>
                    <img src={shop1} />
                </Button>
            </div>
            <div className={classes.quickOrderDialog}>
                <Dialog
                    title="Quick Order Form"
                    shouldHideCancelButton={true}
                    isOpen={isOpen}
                    shouldShowButtons={false}
                    onCancel={() => setIsOpen(false)}
                    dialogName="DialogQuick"
                >
                    <div>
                        <div className={classes.gridWrapper}>
                            <div>
                                <div className={classes.labalWrapper}>
                                    <div>
                                        <span>Item #</span>
                                    </div>
                                    <div>
                                        <span>Qty</span>
                                    </div>

                                    <div>
                                        <span>Price</span>
                                    </div>
                                </div>
                                <div className={classes.m_1}>
                                    {products &&
                                        products.map((item, key) => (
                                            <div key={key} className={classes.labalWrapper}>
                                                <div className={classes.searchBar}>
                                                    <SearchBar
                                                        isOpen={true}
                                                        handleSearchClick={product => handleSearchClick(product, key)}
                                                        setSearchText={e => handleChangeText(e, key)}
                                                        searchText={item.name}
                                                        quickOrder={true}
                                                        placeholder={formatMessage({
                                                            id: 'quickOrder.SearchProduct',
                                                            defaultMessage: 'Enter SKU or name of product'
                                                        })}
                                                        value={item.name}
                                                    />
                                                </div>
                                                {quantitySelector(item, key)}
                                                {/* <div className={classes.inputQtyQuick}>
                                                    <QuantityFields
                                                        initialValue={item.quantity}
                                                        fieldName={'quantity' + item.id}
                                                        min={0}
                                                        quickOrder={true}
                                                        itemId={item.id}
                                                        onChange={e => onChangeQty(e, key)}
                                                        hideButtons={true}
                                                    />
                                                </div> */}
                                                <div className={classes.priceWrapper}>
                                                    {item.price ? (
                                                        <span className={classes.priceText}>
                                                            {' '}
                                                            {item.price.regularPrice.amount.currency === 'USD'
                                                                ? '$'
                                                                : '€'}
                                                            {(
                                                                item.price.regularPrice.amount.value * item.quantity
                                                            ).toFixed(2)}
                                                        </span>
                                                    ) : (
                                                        <span className={classes.spanUnAailable}>Unavailable</span>
                                                    )}
                                                </div>
                                                {key === products.length - 1 ? (
                                                    <div>
                                                        <Button className={classes.downloadBtn} onClick={addProduct}>
                                                            <Icon src={PlusCircle} alt="download-icon" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <Button
                                                            onClick={() => removeProduct(key)}
                                                            className={`${classes.downloadBtn} ${classes.removeIcon}`}
                                                        >
                                                            <Icon src={XCircle} />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            </div>
                            <div>
                                <div className={classes.uploadContainer}>
                                    <h5 className={classes.uploadHeader}>Upload your order</h5>
                                    <p>Here you can upload own file XLS, XLSX or CSV and products to cart.</p>
                                    <div>
                                        <Button type="button" priority="high" onClick={handleCSVFile}>
                                            Upload your file
                                        </Button>
                                    </div>
                                    <CSVLink data={csvData}>
                                        <Button className={classes.downloadBtn}>
                                            <Icon src={Download} alt="download-icon" />
                                            Download your sample file
                                        </Button>
                                    </CSVLink>
                                </div>
                            </div>
                        </div>
                        <div className={classes.btnContainer}>
                            <div>
                                <Button type="button" priority="high" onClick={addToCartClick}>
                                    Add to cart
                                    <Icon className={classes.addCartIcon} src={ArrowDown} alt="arrowDown-icon" />
                                </Button>
                            </div>
                            <div>
                                <Button type="button" priority="high" onClick={addQuoteClick}>
                                    Get Quote
                                </Button>
                            </div>
                            <div>
                                <Button type="button" priority="high" onClick={createOrderClick}>
                                    Create Order
                                </Button>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        </>
    );
};

export default AddQuickOrder;
