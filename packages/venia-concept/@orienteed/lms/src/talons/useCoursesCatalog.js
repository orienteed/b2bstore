import { useCallback } from 'react';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import OPERATIONS from '../graphql/getUserCourses.gql';

export const useCoursesCatalog = props => {
    const { getMoodleTokenAndIdQuery } = OPERATIONS;
    const fetchMoodleTokenAndId = useAwaitQuery(getMoodleTokenAndIdQuery);

    let userMoodleToken = localStorage.getItem('LMS_INTEGRATION_moodle_token');
    let userMoodleId = localStorage.getItem('LMS_INTEGRATION_moodle_id');

    const getAndSaveMoodleTokenAndId = useCallback(async () => {
        const responseData = await fetchMoodleTokenAndId();
        userMoodleToken = responseData.data.customer.moodle_token;
        userMoodleId = responseData.data.customer.moodle_id;
        localStorage.setItem('LMS_INTEGRATION_moodle_token', userMoodleToken);
        localStorage.setItem('LMS_INTEGRATION_moodle_id', userMoodleId);
    }, []);

    userMoodleToken !== null && userMoodleId !== null ? null : getAndSaveMoodleTokenAndId();

    return {
        userMoodleToken,
        userMoodleId
    };
};
