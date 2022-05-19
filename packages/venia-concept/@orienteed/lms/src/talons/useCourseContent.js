import { useState, useEffect } from 'react';

import getCourseContent from '../../services/getCourseContent';
import getCourseDetails from '../../services/getCourseDetails';
import enrollUserInCourse from '../../services/enrollUserInCourse';
import unenrollUserFromCourse from '../../services/unenrollUserFromCourse';

export const useCourseContent = props => {
    const { userMoodleToken, userMoodleId, userCoursesIdList, setUserCoursesIdList, courseId, isEnrolled } = props;

    const [courseDetails, setCourseDetails] = useState();
    const [courseContent, setCourseContent] = useState();
    const [enrolled, setEnrolled] = useState(isEnrolled);

    useEffect(() => {
        getCourseDetails(courseId).then(reply => setCourseDetails(reply.courses[0]));
    }, [courseId]);

    useEffect(() => {
        enrolled
            ? getCourseContent(courseId, userMoodleToken).then(reply => setCourseContent([...reply]))
            : getCourseContent(courseId).then(reply => setCourseContent([...reply]));
    }, [courseId, userMoodleToken, enrolled]);

    const handleEnrollInCourse = () => {
        enrollUserInCourse(userMoodleId, courseId).then(reply => (reply ? setEnrolled(true) : null));
        setUserCoursesIdList(prevState => [...prevState, parseInt(courseId)]);
    };

    const handleUnenrollFromCourse = () => {
        unenrollUserFromCourse(userMoodleId, courseId).then(reply => (reply ? setEnrolled(false) : null));
        const userCoursesIdListUpdate = userCoursesIdList.filter(value => {
            return value !== parseInt(courseId) ? value : null;
        });
        setUserCoursesIdList(userCoursesIdListUpdate);
    };

    return { courseDetails, courseContent, enrolled, handleEnrollInCourse, handleUnenrollFromCourse };
};
