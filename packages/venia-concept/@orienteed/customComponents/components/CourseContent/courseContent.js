import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation, useHistory, Link } from 'react-router-dom';
import { ArrowLeft as BackIcon } from 'react-feather';

import Icon from '@magento/venia-ui/lib/components/Icon';
import Button from '@magento/venia-ui/lib/components/Button';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { useUserContext } from '@magento/peregrine/lib/context/user';

import defaultClasses from './courseContent.module.css';
import getCourseContent from '../../services/getCourseContent';
import getCourseDetails from '../../services/getCourseDetails';
import noImageAvailable from '../CoursesCatalog/CourseItem/Icons/noImageAvailable.svg';

const DELIMITER = '/';

const CourseContent = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const [{ isSignedIn }] = useUserContext();
    const { search } = useLocation();
    const history = useHistory();

    if (!isSignedIn) {
        history.push('/');
    }

    const courseId = new URLSearchParams(search).get('id');
    const [courseDetails, setCourseDetails] = useState();
    const [courseContent, setCourseContent] = useState();

    useEffect(() => {
        getCourseDetails(courseId).then(reply =>
            setCourseDetails(reply.courses[0])
        );
        getCourseContent(courseId).then(reply => setCourseContent(reply));
    }, [courseId]);

    const breadcrumbs = courseDetails !== undefined && (
        <div className={classes.root} aria-live="polite" aria-busy="false">
            <Link className={classes.link} to="/">
                <FormattedMessage id={'global.home'} defaultMessage={'Home'} />
            </Link>
            <span className={classes.divider}>{DELIMITER}</span>
            <Link className={classes.link} to="/learning">
                <FormattedMessage
                    id={'global.learning'} // TODO_B2B: Translations
                    defaultMessage={'Learning'}
                />
            </Link>
            <span className={classes.divider}>{DELIMITER}</span>
            <span className={classes.currentPage}>
                {courseDetails.fullname}
            </span>
        </div>
    );

    return (
        <div className={classes.container}>
            {breadcrumbs}
            <div className={classes.courseContainer}>
                {courseDetails !== undefined && (
                    <div className={classes.headerCourseContainer}>
                        {courseDetails.overviewfiles.length !== 0 ? (
                            <img
                                className={classes.courseImage}
                                src={`${
                                    courseDetails.overviewfiles[0].fileurl
                                }?token=af547e6e35fca251a48ff4bedb7f1298`}
                                alt="Course logo"
                            />
                        ) : (
                            <img
                                className={classes.courseImage}
                                src={noImageAvailable}
                                alt="Course logo not available"
                            />
                        )}
                        <div>
                            <p className={classes.courseTitle}>
                                {courseDetails.fullname}
                            </p>
                            <p className={classes.summaryText}>
                                {courseDetails.summary}
                            </p>
                        </div>
                    </div>
                )}
                {courseContent !== undefined && (
                    <div className={classes.bodyCourseContainer}>
                        {courseContent.map(course => {
                            return (
                                course.modules.length !== 0 && (
                                    <p className={classes.sectionTitle}>{course.name}</p>
                                )
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseContent;
