/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/scope */
import React, { useMemo } from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { FormattedMessage, useIntl } from 'react-intl';
import defaultClasses from './userRolesTable.module.css';
import EditImg from '../../images/edit.svg';
import DeleteImg from '../../images/delete.svg';

const UserRolesTable = props => {
    const { userRoles, handleOpenDeleteModal, handleEditUser } = props;
    const classes = useStyle(defaultClasses);
    const { formatMessage } = useIntl();

    const userRoleRow = useMemo(() => {
        return userRoles?.map(ele => {
            const { role_id, name, order_amount, order_quantity } = ele;
            return (
                <tr key={role_id} className={classes.rowTable}>
                    <td
                        scope="row"
                        data-label={formatMessage({ id: 'companyAccount.ID', defaultMessage: 'ID' })}
                        className={classes.tableCell}
                    >
                        {role_id}
                    </td>
                    <td
                        data-label={formatMessage({ id: 'companyAccount.Name', defaultMessage: 'Name' })}
                        className={classes.tableCell}
                    >
                        {name}
                    </td>
                    <td
                        data-label={formatMessage({ id: 'companyAccount.orderAmount', defaultMessage: 'Order Amount' })}
                        className={classes.tableCell}
                    >
                        {order_amount}
                    </td>
                    <td
                        data-label={formatMessage({ id: 'companyAccount.orderQty', defaultMessage: 'Order Quantity' })}
                        className={classes.tableCell}
                    >
                        {order_quantity}
                    </td>
                    <td
                        data-label={formatMessage({ id: 'companyAccount.actions', defaultMessage: 'Actions' })}
                        className={`${classes.tableCell} ${classes.actionsWrapper}`}
                    >
                        <span onClick={() => handleEditUser(ele)} className={classes.actionBtn}>
                            <img width="16" alt="EditImg" src={EditImg} />
                            <FormattedMessage id={'companyAccount.edit'} defaultMessage="Edit" />
                        </span>
                        <span onClick={() => handleOpenDeleteModal(ele)} className={classes.actionBtn}>
                            <img width="16" alt="DeleteImg" src={DeleteImg} />
                            <FormattedMessage id={'companyAccount.Delete'} defaultMessage="Delete" />
                        </span>
                    </td>
                </tr>
            );
        });
    }, [userRoles, classes, formatMessage, handleOpenDeleteModal, handleEditUser]);
    return (
        <div>
            <div className={classes.tableWrapper}>
                <table className={classes.tableUsers}>
                    <thead>
                        <tr className={classes.headerRow}>
                            <th scope="col" className={classes.headerCeil}>
                                <FormattedMessage id={'companyAccount.ID'} defaultMessage="ID" />
                            </th>
                            <th scope="col" className={classes.headerCeil}>
                                <FormattedMessage id={'companyAccount.Name'} defaultMessage="Name" />
                            </th>
                            <th scope="col" className={classes.headerCeil}>
                                <FormattedMessage id={'companyAccount.orderAmount'} defaultMessage="Order Amount" />
                            </th>
                            <th scope="col" className={classes.headerCeil}>
                                <FormattedMessage id={'companyAccount.orderQty'} defaultMessage="Order Quantity" />
                            </th>
                            <th scope="col" className={classes.headerCeil}>
                                <FormattedMessage id={'companyAccount.actions'} defaultMessage="Actions" />
                            </th>
                        </tr>
                    </thead>
                    <tbody>{userRoleRow}</tbody>
                </table>
            </div>
        </div>
    );
};

export default UserRolesTable;
