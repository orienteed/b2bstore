import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation, useHistory, Link } from 'react-router-dom';

import Button from '@magento/venia-ui/lib/components/Button';
import CourseModuleContent from '../CourseModuleContent/courseModuleContent';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useCoursesCatalog } from '../../talons/useCoursesCatalog';

import defaultClasses from './courseContent.module.css';

import noImageAvailable from '../CourseItem/Icons/noImageAvailable.svg';
import checkIcon from './Icons/check.svg';
import { useCourseContent } from '../../talons/useCourseContent';

const DELIMITER = '/';

const CourseContent = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const history = useHistory();
    const { search } = useLocation();
    const [{ isSignedIn }] = useUserContext();
    const courseId = new URLSearchParams(search).get('id');
    if (!isSignedIn) {
        history.push('/');
    }

    const { userMoodleId, userMoodleToken, userCoursesIdList } = useCoursesCatalog();
    const { courseDetails, courseContent, enrolled, handleEnrollInCourse } = useCourseContent({
        userMoodleToken,
        userMoodleId,
        userCoursesIdList,
        courseId
    });

    const breadcrumbs = courseDetails !== undefined && (
        <nav className={classes.root} aria-live="polite" aria-busy="false">
            <Link className={classes.link} to="/">
                <FormattedMessage id={'global.home'} defaultMessage={'Home'} />
            </Link>
            <span className={classes.divider}>{DELIMITER}</span>
            <Link className={classes.link} to="/learning">
                <FormattedMessage id={'lms.learning'} defaultMessage={'Learning'} />
            </Link>
            <span className={classes.divider}>{DELIMITER}</span>
            <span className={classes.currentPage}>{courseDetails.fullname}</span>
        </nav>
    );

    const showCourseModules = course => {
        return (
            <div key={course.id} className={classes.courseSectionContainer}>
                <p className={classes.sectionTitle}>{course.name}</p>
                {course.modules.map(module => {
                    return <CourseModuleContent courseModule={module} isEnrolled={enrolled} key={module.id} />;
                })}
            </div>
        );
    };

    return (
        <div className={classes.container}>
            {breadcrumbs}
            <div className={classes.courseContainer}>
                {courseDetails !== undefined && (
                    <div className={classes.headerCourseContainer}>
                        {courseDetails.overviewfiles.length !== 0 ? (
                            <img
                                className={classes.courseImage}
                                src={`${courseDetails.overviewfiles[0].fileurl}?token=af547e6e35fca251a48ff4bedb7f1298`}
                                alt="Course logo"
                            />
                        ) : (
                            <img
                                className={classes.courseImage}
                                src={noImageAvailable}
                                alt="Course logo not available"
                            />
                        )}
                        <div className={classes.descriptionAndEnrollContainer}>
                            <div>
                                <p className={classes.courseTitle}>{courseDetails.fullname}</p>
                                <p className={classes.summaryText}>{courseDetails.summary}</p>
                            </div>
                            <div className={classes.enrollButtonContainer}>
                                <Button
                                    className={classes.enrollButton}
                                    onClick={handleEnrollInCourse}
                                    priority={'normal'}
                                >
                                    {enrolled ? (
                                        <>
                                            <img src={checkIcon} className={classes.checkIcon} alt="Enrolled Icon" />
                                            <FormattedMessage id={'lms.enrolled'} defaultMessage={'Enrolled'} />
                                        </>
                                    ) : (
                                        <FormattedMessage id={'lms.enroll'} defaultMessage={'Enroll'} />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
                {courseContent !== undefined && (
                    <>
                        <span className={classes.contentTitle}>
                            <FormattedMessage id={'lms.content'} defaultMessage={'Content'} />
                        </span>
                        <div className={classes.bodyCourseContainer}>
                            {courseContent.map(course => {
                                return course.modules.length !== 0 && showCourseModules(course);
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CourseContent;
