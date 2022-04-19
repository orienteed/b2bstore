import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation, useHistory } from 'react-router-dom';
import { ArrowLeft as BackIcon } from 'react-feather';

import Icon from '@magento/venia-ui/lib/components/Icon';
import Button from '@magento/venia-ui/lib/components/Button';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { useUserContext } from '@magento/peregrine/lib/context/user';

import defaultClasses from './courseContent.module.css';
import getCourseContent from '../../services/getCourseContent';
import getCourseDetails from '../../services/getCourseDetails';
import noImageAvailable from '../CoursesCatalog/CourseItem/Icons/noImageAvailable.svg';

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

    const handleGoBack = () => {
        history.push('/learning');
    };

    return (
        <div className={classes.container}>
            <div className={classes.courseContainer}>
                <Button
                    className={classes.goBackButton}
                    type="button"
                    onClick={handleGoBack}
                >
                    <Icon
                        size={16}
                        src={BackIcon}
                        classes={{
                            icon: classes.arrowLeftIcon
                        }}
                    />
                    <FormattedMessage // TODO_B2B: Translations
                        id={'moodleCourse.goBackText'}
                        defaultMessage={'Volver a cursos'}
                    />
                </Button>
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
                            <p className={classes.courseTitle}>{courseDetails.fullname}</p>
                            <p className={classes.summaryText}>{courseDetails.summary}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseContent;
