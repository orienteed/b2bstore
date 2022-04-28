import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import { useCoursesCatalog } from '../../talons/useCoursesCatalog';

import defaultClasses from './coursesCatalog.module.css';
import getCourses from '../../../services/getCourses';
import getUserCourses from '../../../services/getUserCourses';
import CourseItem from '../CourseItem/courseItem';

import noCoursesImage from './Icons/noCourses.svg';

const DELIMITER = '/';

const CoursesCatalog = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = useCoursesCatalog();

    const { userMoodleToken, userMoodleId } = talonProps;

    const [buttonSelected, setSelectedButton] = useState('all');
    const [courses, setCourses] = useState();
    const [userCourses, setUserCourses] = useState();

    const handleGoToInProgress = () => {
        setSelectedButton('inProgress');
    };

    const handleGoToAllCourses = () => {
        setSelectedButton('all');
    };

    useEffect(() => {
        getCourses().then(coursesData => setCourses(coursesData));
        getUserCourses(userMoodleToken, userMoodleId).then(userCoursesData => setUserCourses(userCoursesData));
    }, []);

    const emptyUserCoursesMessage = (
        <div className={classes.emptyUserCoursesAdviceContainer}>
            <img src={noCoursesImage} className={classes.noCoursesImage} />
            <div>
                <p className={classes.emptyUserCoursesAdviceText}>
                    <FormattedMessage
                        id={'lms.emptyUserCoursesAdvice'}
                        defaultMessage={"Oops... Looks like you haven't started any courses\n"}
                    />
                </p>
                <p className={classes.emptyUserCoursesAdviceText}>
                    <FormattedMessage
                        id={'lms.startCoursesAdvice'}
                        defaultMessage={"You can start a course from the 'All Courses' section\n"}
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
            <div className={classes.root} aria-live="polite" aria-busy="false">
                <Link className={classes.link} to="/">
                    <FormattedMessage id={'global.home'} defaultMessage={'Home'} />
                </Link>
                <span className={classes.divider}>{DELIMITER}</span>
                <span className={classes.currentPage}>Learning</span>
            </div>
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
                    <FormattedMessage id={'lms.progressCourses'} defaultMessage={'Course in progress'} />
                </Button>
            </div>
            {buttonSelected === 'all' ? (
                <div className={classes.bodyContainer}>
                    <h1 className={classes.pageTitle}>List of our courses online</h1>
                    <div className={classes.courseContainer}>
                        {courses !== undefined &&
                            courses.map(course => {
                                return <CourseItem key={course.id} data={course} />;
                            })}
                    </div>
                </div>
            ) : (
                <div className={classes.bodyContainer}>
                    <h1 className={classes.pageTitle}>Your courses in progress</h1>

                    {userCourses.length !== 0 ? (
                        <div className={classes.courseContainer}>
                            {userCourses.map(course => {
                                return <CourseItem key={course.id} data={course} />;
                            })}{' '}
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
