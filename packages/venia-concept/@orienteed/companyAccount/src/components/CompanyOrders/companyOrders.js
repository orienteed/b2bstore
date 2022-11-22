import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { useCompanyAccountOrders } from '@orienteed/companyAccount/src/talons/useCompanyAccountOrders';
import FullPageLoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import SideMenu from '../SideMenu';
import OrdersTable from './OrdersTable';
import defaultClasses from './companyorders.module.css';

const Companyorders = () => {
    const { companyOrders, loading, handleReOrderBtn } = useCompanyAccountOrders();

    if (loading) {
        return <FullPageLoadingIndicator />;
    }
    const classes = useStyle(defaultClasses);
    return (
        <div>
            <div className={classes.titleContainer}>
                <h2>Orders</h2>
            </div>
            <div className={classes.contentContainer}>
                <div>
                    <SideMenu />
                </div>
                <div>
                    <div className={classes.tableContainer}>
                        <OrdersTable
                            orders={companyOrders?.mpCompanyAccountsOrders}
                            handleReOrderBtn={handleReOrderBtn}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Companyorders;
