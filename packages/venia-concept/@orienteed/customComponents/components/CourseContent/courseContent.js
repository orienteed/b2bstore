import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation, useHistory } from 'react-router-dom';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { useUserContext } from '@magento/peregrine/lib/context/user';

import defaultClasses from './courseContent.module.css';
import getCourseContent from '../../services/getCourseContent';

const CourseContent = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { search } = useLocation();
    const history = useHistory();

    const [{ isSignedIn }] = useUserContext();
    if (!isSignedIn) {
        history.push('/');
    }

    const courseId = new URLSearchParams(search).get('id');
    const [courseData, setCourseData] = useState();

    useEffect(() => {
        getCourseContent(courseId).then(reply => setCourseData(reply));
    }, [courseId]);

    return (
        <div className={classes.container}>
            <p>{courseId}</p>
            {courseData !== undefined && <p>{JSON.stringify(courseData)}</p>}
        </div>
    );
};

export default CourseContent;
