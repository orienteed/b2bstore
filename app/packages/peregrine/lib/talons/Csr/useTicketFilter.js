import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useEffect, useState } from 'react';

import getGroups from '../../RestApi/Csr/groups/getGroups';
import getStates from '../../RestApi/Csr/tickets/ticket_states/getStates';

export const useTicketFilter = props => {
	const [{ isSignedIn }] = useUserContext();

	const { setFilterByStatus, setFilterByType, setNumPage, setMultipleTickets } = props;
	const [activeFilterByType, setActiveFilterByType] = useState([]);
	const [activeFilterByStatus, setActiveFilterByStatus] = useState([]);
	const [states, setStates] = useState();
	const [groups, setGroups] = useState();

	useEffect(() => {
		if (isSignedIn) {
			getStates().then(res => {
				setStates(res);
			});
			getGroups().then(res => {
				setGroups(res);
			});
		}
	}, [isSignedIn]);

	const filterByFunction = filterId => {
		if (filterId.attribute === 'type') {
			if (!activeFilterByType.includes(filterId.groupId)) {
				setFilterByType([...activeFilterByType, filterId.groupId]);
			} else {
				setFilterByType(activeFilterByType.filter(item => item !== filterId.groupId));
			}
		} else {
			if (!activeFilterByStatus.includes(filterId.groupId)) {
				setFilterByStatus([...activeFilterByStatus, filterId.groupId]);
			} else {
				setFilterByStatus(activeFilterByStatus.filter(item => item !== filterId.groupId));
			}
		}
		setMultipleTickets(false);
		setNumPage([1]);
	};

	return {
		activeFilterByStatus,
		activeFilterByType,
		filterByFunction,
		groups,
		setActiveFilterByStatus,
		setActiveFilterByType,
		states
	};
};
