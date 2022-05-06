import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Button from '@magento/venia-ui/lib/components/Button';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './QuickOrder.module.css';
import { Download, PlusCircle, ArrowDown, ShoppingBag } from 'react-feather';
import Dialog from '../../../../src/components/Dialog/dialog';
import { useAddProductsByCSV } from '@magento/peregrine/lib/talons/useAddProductsByCSV';
import SearchBar from '../../../../src/components/SearchBar';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { CSVLink } from 'react-csv';
import Quantity from '../../../../src/components/ProductListing/quantity';
import { useHistory } from 'react-router-dom';
import { useToasts } from '@magento/peregrine';
let iniArray = [{}, {}, {}];

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
        setProducts(newProducts);
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
            if (Object.keys(productArr[i]).length > 0) {
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
    return (
        <>
            <div className={classes.btnOrderContainer}>
                <Button className={`${classes.orderIcon} ${classes.gridBtn}`} onClick={onOrderClick}>
                    <Icon src={ShoppingBag} alt="quick-order" />
                </Button>
            </div>
            <div className={classes.quickOrderDialog}>
                <Dialog
                    title="Quick Order Form"
                    shouldHideCancelButton={true}
                    isOpen={isOpen}
                    shouldShowButtons={false}
                    onCancel={() => setIsOpen(false)}
                    dialogName="DialogContainer"
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
                                                <div>
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
                                                <div>
                                                    <Quantity
                                                        initialValue={item.quantity}
                                                        fieldName="quantity"
                                                        min={0}
                                                        quickOrder={true}
                                                        itemId={key}
                                                        onChange={e => onChangeQty(e, key)}
                                                        hideButtons={true}
                                                    />
                                                </div>
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
                                                {key === products.length - 1 && (
                                                    <div>
                                                        <Button className={classes.downloadBtn} onClick={addProduct}>
                                                            <Icon src={PlusCircle} alt="download-icon" />
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
                                    <Button onClick={handleCSVFile} className={classes.orderbtn}>
                                        Upload your file
                                    </Button>
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
                            <Button onClick={addToCartClick} className={classes.orderbtn}>
                                Add to cart
                                <Icon src={ArrowDown} alt="arrowDown-icon" />
                            </Button>
                            <Button onClick={addQuoteClick} className={classes.quoteBtn}>
                                Get Quote
                            </Button>
                            <Button onClick={createOrderClick} className={classes.createOrderBtn}>
                                Create Order
                            </Button>
                        </div>
                    </div>
                </Dialog>
            </div>
        </>
    );
};

export default AddQuickOrder;