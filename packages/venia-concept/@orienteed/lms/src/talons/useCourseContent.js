import { useState, useEffect } from 'react';

import getCourseContent from '../../services/getCourseContent';
import getCourseDetails from '../../services/getCourseDetails';
import enrollUserInCourse from '../../services/enrollUserInCourse';

export const useCourseContent = props => {
    const { userMoodleToken, userMoodleId, userCoursesIdList, courseId } = props;

    const [courseDetails, setCourseDetails] = useState();
    const [courseContent, setCourseContent] = useState();
    const [enrolled, setEnrolled] = useState();

    useEffect(() => {
        if (userCoursesIdList.length !== 0) {
            setEnrolled(userCoursesIdList.includes(parseInt(courseId)));
        }
    }, [userCoursesIdList, courseId, enrolled, userMoodleToken]);

    useEffect(() => {
        getCourseDetails(courseId).then(reply => setCourseDetails(reply.courses[0]));
    }, [courseId]);

    useEffect(() => {
        enrolled
            ? getCourseContent(courseId, userMoodleToken).then(reply => setCourseContent([...reply]))
            : getCourseContent(courseId).then(reply => setCourseContent([...reply]));
    }, [courseId, enrolled, userMoodleToken]);

    const handleEnrollInCourse = () => {
        enrollUserInCourse(userMoodleId, courseId).then(reply => (reply ? setEnrolled(true) : null));
    };

    return { courseDetails, courseContent, enrolled, handleEnrollInCourse };
};
