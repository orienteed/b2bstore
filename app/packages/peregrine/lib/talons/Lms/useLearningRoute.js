import { useState, useEffect, useCallback } from 'react';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import { Magento2 } from '@magento/peregrine/lib/RestApi';

import { useLMSContext } from '../../../../venia-ui/lib/components/Lms/lmsProvider/lmsProvider';

export const useLearningRoute = () => {
    const [{ isSignedIn }] = useUserContext();

    const { courses, setCourses, userCourses, setUserCourses } = useLMSContext();

    const [userCoursesIdList, setUserCoursesIdList] = useState([]);
    const [userCoursesIdListQty, setUserCoursesIdListQty] = useState(0);
    const [markAsDoneListQty, setMarkAsDoneListQty] = useState([]);
    const [buttonSelected, setSelectedButton] = useState('all');

    const getCourses = useCallback(async () => {
        const { request } = Magento2;

        const reply = await request('/lms/api/v1/courses/', {
            method: 'GET',
            credentials: 'include'
        });

        return reply.courses.slice(1);
    }, []);

    const getUserCourses = useCallback(async () => {
        const { request } = Magento2;

        const reply = await request('/lms/api/v1/courses/progress', {
            method: 'GET',
            credentials: 'include'
        });

        return reply;
    }, []);

    useEffect(() => {
        if (isSignedIn) {
            getCourses().then(coursesData => setCourses(coursesData));
        }
    }, [getCourses, isSignedIn, setCourses]);

    useEffect(() => {
        if (isSignedIn) {
            getUserCourses().then(userCoursesData => setUserCourses(userCoursesData));
        }
    }, [userCoursesIdListQty, markAsDoneListQty, isSignedIn, setUserCourses, getUserCourses]);

    useEffect(() => {
        if (isSignedIn) {
            if (userCourses) {
                const userCoursesIds = userCourses.map(course => {
                    return course.id;
                });
                setUserCoursesIdList(userCoursesIds);
            }
        }
    }, [userCourses, isSignedIn]);

    useEffect(() => {
        if (isSignedIn) {
            if (userCoursesIdList.length > userCoursesIdListQty) {
                setUserCoursesIdListQty(userCoursesIdList.length);
            } else if (userCoursesIdList.length < userCoursesIdListQty) {
                setUserCoursesIdListQty(userCoursesIdList.length);
            }
        }
    }, [userCoursesIdList.length, userCoursesIdListQty, isSignedIn]);

    return {
        buttonSelected,
        setSelectedButton,
        courses,
        userCourses,
        userCoursesIdList,
        setUserCoursesIdList,
        setMarkAsDoneListQty
    };
};
