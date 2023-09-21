import React, { Suspense } from 'react';

import { Accordion, Section } from '@magento/venia-ui/lib/components/Accordion';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useIntl } from 'react-intl';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './UserRules.module.css';

const UserRules = () => {
    const classes = useStyle(defaultClasses);
    const { formatMessage } = useIntl();

    const ViewLabel = formatMessage({
        id: 'quotesTable.quotesViewText',
        defaultMessage: 'View'
    });
    const addLabel = formatMessage({
        id: 'global.addButton',
        defaultMessage: 'Add'
    });
    const editLabel = formatMessage({
        id: 'companyAccount.edit',
        defaultMessage: 'Edit'
    });
    const deleteLabel = formatMessage({
        id: 'companyAccount.delete',
        defaultMessage: 'Delete'
    });
    const ViewOrderLabel = formatMessage({
        id: 'companyAccount.ViewOrderLabel',
        defaultMessage: 'View Orders'
    });
    return (
        <div className={classes.userRulesContainer}>
            <Accordion canOpenMultiple={true}>
                <Section
                    data-cy="companyAccount.companyInformation"
                    id={'coupon_code'}
                    title={formatMessage({
                        id: 'companyAccount.companyInformation',
                        defaultMessage: 'Company Information'
                    })}
                >
                    <Suspense fallback={<LoadingIndicator />}>
                        <Checkbox field="Mageplaza_CompanyAccounts::info_view" label={ViewLabel} />
                        <Checkbox field="Mageplaza_CompanyAccounts::info_edit" label={editLabel} />
                    </Suspense>
                </Section>
            </Accordion>

            <Accordion canOpenMultiple={true}>
                <Section
                    data-cy="companyAccount-ManageUsers"
                    id={'coupon_code'}
                    title={formatMessage({
                        id: 'companyAccount.ManageUsers',
                        defaultMessage: 'Manage Users'
                    })}
                >
                    <Suspense fallback={<LoadingIndicator />}>
                        <Checkbox field="Mageplaza_CompanyAccounts::user_view" label={ViewLabel} />
                        <Checkbox field="Mageplaza_CompanyAccounts::user_add" label={addLabel} />
                        <Checkbox field="Mageplaza_CompanyAccounts::user_edit" label={editLabel} />
                        <Checkbox field="Mageplaza_CompanyAccounts::user_delete" label={deleteLabel} />
                    </Suspense>
                </Section>
            </Accordion>
            <Accordion canOpenMultiple={true}>
                <Section
                    data-cy="companyAccount-ManageOrders"
                    id={'coupon_code'}
                    title={formatMessage({
                        id: 'companyAccount.ManageOrders',
                        defaultMessage: 'Manage Orders'
                    })}
                >
                    <Suspense fallback={<LoadingIndicator />}>
                        <Checkbox field="Mageplaza_CompanyAccounts::view_orders" label={ViewOrderLabel} />
                    </Suspense>
                </Section>
            </Accordion>
            <Accordion canOpenMultiple={true}>
                <Section
                    data-cy="companyAccount-ManageRoles"
                    id={'coupon_code'}
                    title={formatMessage({
                        id: 'companyAccount.ManageRules',
                        defaultMessage: 'Manage Rules'
                    })}
                >
                    <Suspense fallback={<LoadingIndicator />}>
                        <Checkbox field="Mageplaza_CompanyAccounts::role_view" label={ViewLabel} />
                        <Checkbox field="Mageplaza_CompanyAccounts::role_add" label={addLabel} />
                        <Checkbox field="Mageplaza_CompanyAccounts::role_edit" label={editLabel} />
                        <Checkbox field="Mageplaza_CompanyAccounts::role_delete" label={deleteLabel} />
                    </Suspense>
                </Section>
            </Accordion>
        </div>
    );
};

export default UserRules;