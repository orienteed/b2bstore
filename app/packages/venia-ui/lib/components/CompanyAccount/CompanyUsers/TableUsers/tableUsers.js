/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useMemo } from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './tableUsers.module.css';
import { FormattedMessage, useIntl } from 'react-intl';
import EditImg from '../../images/edit.svg';
import DeleteImg from '../../images/delete.svg';

const TableUsers = ({ users, handleEditUser, handleOpenDeleteModal }) => {
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses);

    const usersRows = useMemo(() => {
        return users?.map(ele => {
            const { entity_id, firstname, lastname, email, mpca_role_id, mpca_is_active } = ele;
            return (
                <tr key={entity_id} className={classes.rowTable}>
                    <td
                        // eslint-disable-next-line jsx-a11y/scope
                        scope="row"
                        data-label={formatMessage({ id: 'companyAccount.ID', defaultMessage: 'ID' })}
                        className={classes.tableCell}
                    >
                        {entity_id}
                    </td>
                    <td
                        data-label={formatMessage({ id: 'companyAccount.Name', defaultMessage: 'Name' })}
                        className={classes.tableCell}
                    >
                        {firstname + ' ' + lastname}
                    </td>
                    <td
                        data-label={formatMessage({ id: 'companyAccount.email', defaultMessage: 'Email' })}
                        className={classes.tableCell}
                    >
                        {email}
                    </td>
                    <td
                        data-label={formatMessage({ id: 'companyAccount.role', defaultMessage: 'Role' })}
                        className={classes.tableCell}
                    >
                        {mpca_role_id || '-'}
                    </td>
                    <td
                        data-label={formatMessage({ id: 'companyAccount.status', defaultMessage: 'Status' })}
                        className={classes.tableCell}
                    >
                        {mpca_is_active ? (
                            <FormattedMessage id={'companyAccount.active'} defaultMessage="Active" />
                        ) : (
                            <FormattedMessage id={'companyAccount.Inactive'} defaultMessage="Inactive" />
                        )}
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
    }, [users, classes, formatMessage, handleEditUser, handleOpenDeleteModal]);
    return (
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
                            <FormattedMessage id={'companyAccount.email'} defaultMessage="Email" />
                        </th>
                        <th scope="col" className={classes.headerCeil}>
                            <FormattedMessage id={'companyAccount.role'} defaultMessage="Role" />
                        </th>
                        <th scope="col" className={classes.headerCeil}>
                            <FormattedMessage id={'companyAccount.status'} defaultMessage="Status" />
                        </th>
                        <th scope="col" className={classes.headerCeil}>
                            <FormattedMessage id={'companyAccount.actions'} defaultMessage="Actions" />
                        </th>
                    </tr>
                </thead>
                <tbody>{usersRows}</tbody>
            </table>
        </div>
    );
};

export default TableUsers;
