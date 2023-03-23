import { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Magento2 } from '@magento/peregrine/lib/RestApi';

export const useCourseContent = props => {
    const { userCoursesIdList, setUserCoursesIdList, courseId, isEnrolled } = props;

    const history = useHistory();

    const [courseContent, setCourseContent] = useState();
    const [courseDetails, setCourseDetails] = useState();
    const [courseNotFound, setCourseNotFound] = useState(false);
    const [enrolled, setEnrolled] = useState(isEnrolled);
    const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);

    const getCourseDetails = useCallback(async id => {
        const { request } = Magento2;

        const reply = await request(`/lms/api/v1/courses/details?id=${id}`, {
            method: 'GET',
            credentials: 'include'
        });

        return reply;
    }, []);

    const getCourseContent = useCallback(async (id, enrolled) => {
        const { request } = Magento2;

        const reply = await request(`/lms/api/v1/courses/content?id=${id}&enrolled=${enrolled.toString()}`, {
            method: 'GET',
            credentials: 'include'
        });

        return reply;
    }, []);

    const enrollUser = useCallback(async courseId => {
        const { request } = Magento2;

        const reply = await request(`/lms/api/v1/enrollment/enroll?courseId=${courseId}`, {
            method: 'GET',
            credentials: 'include'
        });

        return reply;
    }, []);

    const unEnrollUser = useCallback(async courseId => {
        const { request } = Magento2;

        const reply = await request(`/lms/api/v1/enrollment/unenroll?courseId=${courseId}`, {
            method: 'GET',
            credentials: 'include'
        });

        return reply;
    }, []);

    useEffect(() => {
        getCourseDetails(courseId).then(reply => setCourseDetails(reply.courses[0]));
    }, [courseId, getCourseDetails]);

    useEffect(() => {
        getCourseContent(courseId, enrolled).then(reply =>
            Array.isArray(reply)
                ? setCourseContent([...reply])
                : reply.hasOwnProperty('errorcode') && reply.errorcode === 'invalidrecord' && setCourseNotFound(true)
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseId]);

    useEffect(() => {
        setEnrolled(isEnrolled);
    }, [isEnrolled]);

    const handleEnrollInCourse = () => {
        enrollUser(courseId).then(reply => (reply ? setEnrolled(true) : null));
        setUserCoursesIdList(prevState => [...prevState, parseInt(courseId)]);
        getCourseContent(courseId, true).then(reply =>
            Array.isArray(reply)
                ? setCourseContent([...reply])
                : reply.hasOwnProperty('errorcode') && reply.errorcode === 'invalidrecord' && setCourseNotFound(true)
        );
        setConfirmationModalOpen(false);
        setEnrolled(true);
    };

    const handleUnenrollFromCourse = () => {
        unEnrollUser(courseId).then(reply => (reply ? setEnrolled(false) : null));
        const userCoursesIdListUpdate = userCoursesIdList.filter(value => {
            return value !== parseInt(courseId) ? value : null;
        });
        setUserCoursesIdList(userCoursesIdListUpdate);
        history.push('/learning');
    };

    return {
        courseContent,
        courseDetails,
        courseNotFound,
        enrolled,
        handleEnrollInCourse,
        handleUnenrollFromCourse,
        isConfirmationModalOpen,
        setConfirmationModalOpen
    };
};
