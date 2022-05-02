import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import CourseItem from '../CourseItem/courseItem';
import { useCoursesCatalog } from '../../talons/useCoursesCatalog';
import defaultClasses from './coursesCatalog.module.css';
import noCoursesImage from './Icons/noCourses.svg';

const DELIMITER = '/';

const CoursesCatalog = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const talonProps = useCoursesCatalog();
    const { buttonSelected, setSelectedButton, courses, userCourses, userCoursesIdList } = talonProps;

    const allCoursesTitle = formatMessage({ id: 'lms.allCoursesTitle', defaultMessage: 'List of our courses online' });
    const inProgressCoursesTitle = formatMessage({
        id: 'lms.inProgressCoursesTitle',
        defaultMessage: 'Your courses in progress'
    });
    // const learningTitle = formatMessage({ id: 'lms.learning', defaultMessage: 'Learning' });
    const learningTitle = 'Learning';

    const handleGoToInProgress = () => {
        setSelectedButton('inProgress');
    };

    const handleGoToAllCourses = () => {
        setSelectedButton('all');
    };

    const breadcrumbs = (
        <nav className={classes.root} aria-live="polite" aria-busy="false">
            <Link className={classes.link} to="/">
                <FormattedMessage id={'global.home'} defaultMessage={'Home'} />
            </Link>
            <span className={classes.divider}>{DELIMITER}</span>
            <span className={classes.currentPage}>{learningTitle}</span>
        </nav>
    );

    const emptyCoursesMessage = (
        <div className={classes.emptyUserCoursesAdviceContainer}>
            <img src={noCoursesImage} className={classes.noCoursesImage} alt="No courses icon" />
            <div>
                <p className={classes.emptyUserCoursesAdviceText}>
                    <FormattedMessage
                        id={'lms.emptyAllCoursesAdvice'}
                        defaultMessage={"Oops... Looks like we don't have published any course"}
                    />
                </p>
            </div>
            <Button className={classes.inProgressButton} onClick={handleGoToAllCourses}>
                <FormattedMessage id={'errorView.goHome'} defaultMessage={'Take me home'} />
            </Button>
        </div>
    );

    const emptyUserCoursesMessage = (
        <div className={classes.emptyUserCoursesAdviceContainer}>
            <img src={noCoursesImage} className={classes.noCoursesImage} alt="No courses icon" />
            <div>
                <p className={classes.emptyUserCoursesAdviceText}>
                    <FormattedMessage
                        id={'lms.emptyUserCoursesAdvice'}
                        defaultMessage={"Oops... Looks like you haven't started any courses"}
                    />
                </p>
                <p className={classes.emptyUserCoursesAdviceText}>
                    <FormattedMessage
                        id={'lms.startCoursesAdvice'}
                        defaultMessage={"You can start a course from the 'All Courses' section"}
                    />
                </p>
            </div>
            <Button className={classes.inProgressButton} onClick={handleGoToAllCourses}>
                <FormattedMessage id={'lms.startACourse'} defaultMessage={'Start a course'} />
            </Button>
        </div>
    );

    return (
        <div className={classes.container}>
            {breadcrumbs}
            <div className={classes.switchViewButtonContainer}>
                <Button
                    className={buttonSelected === 'all' ? classes.allCoursesButton : classes.inProgressButton}
                    onClick={handleGoToAllCourses}
                >
                    <FormattedMessage id={'lms.allCourses'} defaultMessage={'All courses'} />
                </Button>
                <Button
                    className={buttonSelected === 'all' ? classes.inProgressButton : classes.allCoursesButton}
                    onClick={handleGoToInProgress}
                >
                    <FormattedMessage id={'lms.progressCourses'} defaultMessage={'Progress courses'} />
                </Button>
            </div>
            {buttonSelected === 'all' ? (
                <div className={classes.bodyContainer}>
                    <h1 className={classes.pageTitle}>{allCoursesTitle}</h1>

                    {courses === undefined ? (
                        <LoadingIndicator />
                    ) : courses.length !== 0 ? (
                        <div className={classes.courseContainer}>
                            {courses.map(course => {
                                return (
                                    <CourseItem
                                        key={course.id}
                                        data={course}
                                        isProgressCourse={userCoursesIdList.includes(course.id)}
                                        isProgressTab={false}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        emptyCoursesMessage
                    )}
                </div>
            ) : (
                <div className={classes.bodyContainer}>
                    <h1 className={classes.pageTitle}>{inProgressCoursesTitle}</h1>

                    {userCourses === undefined ? (
                        <LoadingIndicator />
                    ) : userCourses.length !== 0 ? (
                        <div className={classes.courseContainer}>
                            {userCourses.map(course => {
                                return (
                                    <CourseItem
                                        key={course.id}
                                        data={course}
                                        isProgressCourse={userCoursesIdList.includes(course.id)}
                                        isProgressTab={true}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        emptyUserCoursesMessage
                    )}
                </div>
            )}
        </div>
    );
};

export default CoursesCatalog;
