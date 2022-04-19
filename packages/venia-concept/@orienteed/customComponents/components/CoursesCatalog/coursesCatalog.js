import React, { useState, useEffect } from 'react';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './coursesCatalog.module.css';
import getCourses from '../../services/getCourses';
import CourseItem from './CourseItem/courseItem';

const CoursesCatalog = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const [courses, setCourses] = useState();

    useEffect(() => {
        getCourses().then(coursesData => setCourses(coursesData));
    }, []);

    return (
        <div className={classes.container}>
            <h1 className={classes.pageTitle}>List of our courses online</h1>
            <div className={classes.courseContainer}>
                {courses !== undefined &&
                    courses.map(course => {
                        return <CourseItem data={course} />;
                    })}
            </div>
        </div>
    );
};

export default CoursesCatalog;
