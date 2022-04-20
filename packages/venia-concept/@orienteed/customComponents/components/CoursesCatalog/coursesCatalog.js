import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './coursesCatalog.module.css';
import getCourses from '../../services/getCourses';
import CourseItem from './CourseItem/courseItem';

const DELIMITER = '/';

const CoursesCatalog = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const [courses, setCourses] = useState();

    useEffect(() => {
        getCourses().then(coursesData => setCourses(coursesData));
    }, []);

    return (
        <div className={classes.container}>
            <div className={classes.root} aria-live="polite" aria-busy="false">
                <Link className={classes.link} to="/">
                    <FormattedMessage
                        id={'global.home'}
                        defaultMessage={'Home'}
                    />
                </Link>
                <span className={classes.divider}>{DELIMITER}</span>
                <span className={classes.currentPage}>Learning</span>
            </div>
            <h1 className={classes.pageTitle}>List of our courses online</h1>
            <div className={classes.courseContainer}>
                {courses !== undefined &&
                    courses.map(course => {
                        return <CourseItem key={course.id} data={course} />;
                    })}
            </div>
        </div>
    );
};

export default CoursesCatalog;
