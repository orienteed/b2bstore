import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './adsBanner.css';

const AdsBanner = () => {
    const classes = mergeClasses(defaultClasses);
    const { formatMessage } = useIntl();

    return <h1>hello</h1>;
};

export default AdsBanner;
