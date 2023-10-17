import React from 'react';
import Button from '@magento/venia-ui/lib/components/Button';
import defaultClasses from './NotifyPrice.module.css';
import { useStyle } from '../../../classify';
import { FormattedMessage } from 'react-intl';
import { Bell } from 'react-feather';
import Icon from '../../Icon';
import Tippy from '@tippyjs/react';
import { useModulesContext } from '@magento/peregrine/lib/context/modulesProvider';

const NotifyPrice = props => {
    const { handleOpenPriceModal } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { tenantConfig } = useModulesContext();

    const iconB2B = (
        <Tippy
            content={
                <ul className={classes.list}>
                    <FormattedMessage id="productAlert.NotifyPrice" defaultMessage="Notify me when the price drops" />
                </ul>
            }
        >
            <div className={classes.iconContainer} onClick={handleOpenPriceModal}>
                <Icon src={Bell} size={14} />
            </div>
        </Tippy>
    );

    const buttonAlertPrice = (
        <Button className={classes.root} onPress={handleOpenPriceModal} type="button">
            <span className={classes.textButton}>
                <FormattedMessage id="productAlert.NotifyPrice" defaultMessage="Notify me when the price drops" />
            </span>
        </Button>
    );

    return <div>{tenantConfig.b2bProductDetailView ? iconB2B : buttonAlertPrice}</div>;
};

export default NotifyPrice;
