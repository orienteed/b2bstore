import { useCallback, useState, useEffect } from 'react';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';

import getCourses from '../../services/getCourses';
import getUserCourses from '../../services/getUserCourses';

import OPERATIONS from '../graphql/getUserCourses.gql';

export const useLearningRoute = () => {
    const { getMoodleTokenAndIdQuery } = OPERATIONS;
    const fetchMoodleTokenAndId = useAwaitQuery(getMoodleTokenAndIdQuery);

    const getAndSaveMoodleTokenAndId = useCallback(async () => {
        const responseData = await fetchMoodleTokenAndId();
        localStorage.setItem(
            'LMS_INTEGRATION_moodle_token',
            responseData.data.customer.moodle_token
        );
        localStorage.setItem(
            'LMS_INTEGRATION_moodle_id',
            responseData.data.customer.moodle_id
        );
    }, [fetchMoodleTokenAndId]);

    const userMoodleToken = localStorage.getItem(
        'LMS_INTEGRATION_moodle_token'
    );
    const userMoodleId = localStorage.getItem('LMS_INTEGRATION_moodle_id');
    userMoodleToken !== null && userMoodleId !== null
        ? null
        : getAndSaveMoodleTokenAndId();

    const [courses, setCourses] = useState();
    const [userCourses, setUserCourses] = useState();
    const [userCoursesIdList, setUserCoursesIdList] = useState([]);
    const [buttonSelected, setSelectedButton] = useState('all');

    useEffect(() => {
        getCourses().then(coursesData => setCourses(coursesData));
    }, []);

    useEffect(() => {
        getUserCourses(userMoodleToken, userMoodleId).then(userCoursesData =>
            setUserCourses(userCoursesData)
        );
    }, [userMoodleToken, userMoodleId]);

    useEffect(() => {
        if (userCourses) {
            const userCoursesIds = userCourses.map(course => {
                return course.id;
            });
            setUserCoursesIdList(userCoursesIds);
        }
    }, [userCourses]);

    return {
        userMoodleId,
        userMoodleToken,
        buttonSelected,
        setSelectedButton,
        courses,
        userCourses,
        userCoursesIdList
    };
};
