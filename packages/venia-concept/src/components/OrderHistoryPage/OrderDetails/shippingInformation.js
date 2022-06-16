import React, { Fragment } from 'react';
import { arrayOf, shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from '@magento/venia-ui/lib/components/OrderHistoryPage/OrderDetails/shippingInformation.module.css';
import AddIcon from './Icons/add.svg';
import { Link } from 'react-router-dom';
const ShippingInformation = props => {
    const { data, classes: propsClasses, address } = props;
    const classes = useStyle(defaultClasses, propsClasses);
    let shippingContentElement;

    if (data) {
        const {
            city,
            country_code,
            firstname,
            lastname,
            postcode,
            region,
            street
        } = data;

        const additionalAddressString = `${city}, ${region} ${postcode} ${country_code}`;
        const streetRows = street.map((row, index) => {
            return (
                <span className={classes.streetRow} key={index}>
                    {row}
                </span>
            );
        });

        shippingContentElement = (
            <Fragment>
                <span className={classes.choosetext}>
                    <FormattedMessage
                        id="orderDetails.chooseShippingInformation"
                        defaultMessage="Choose from saved addresses"
                    />
                </span>
                <select className={classes.addressOptions}>
                    {address?.addresses.map(ele => {
                        let rowText =
                            ele.street.join(' ') +
                            ', ' +
                            ele.city +
                            ', ' +
                            ele.country_code;
                        return <option>{rowText}</option>;
                    })}
                </select>
            </Fragment>
        );
    } else {
        shippingContentElement = (
            <FormattedMessage
                id="orderDetails.noShippingInformation"
                defaultMessage="No shipping information"
            />
        );
    }

    return (
        <div
            className={classes.root}
            data-cy="OrderDetails-ShippingInformation-root"
        >
            <div className={classes.heading}>
                <span>1</span>
                <FormattedMessage
                    id="orderDetails.shippingInformationLabel"
                    defaultMessage="Shipping Information"
                />
            </div>
            {shippingContentElement}
            <Link to ='/address-book'>
                <span className={classes.addAddress}>
                    <img src={AddIcon} alt="add address" />
                    <FormattedMessage
                        id="orderDetails.addShippingInformation"
                        defaultMessage="Add new shipping address"
                    />
                </span>
            </Link>
        </div>
    );
};

export default ShippingInformation;

ShippingInformation.propTypes = {
    classes: shape({
        root: string,
        heading: string,
        name: string,
        streetRow: string,
        additionalAddress: string
    }),
    data: shape({
        city: string,
        country_code: string,
        firstname: string,
        lastname: string,
        postcode: string,
        region: string,
        street: arrayOf(string),
        telephone: string
    })
};
