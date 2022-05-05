import React from 'react';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';

import Button from '@magento/venia-ui/lib/components/Button';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './courseItem.module.css';
import noImageAvailable from './Icons/noImageAvailable.svg';
import inProgressIcon from './Icons/inProgress.svg';

const CourseItem = props => {
    const { data, isProgressCourse, isProgressTab } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const history = useHistory();
    const { formatMessage } = useIntl();

    const startCourseText = formatMessage({
        id: 'lms.watchCourse',
        defaultMessage: 'Watch Course'
    });

    const resumeCourseText = formatMessage({
        id: 'lms.resumeCourse',
        defaultMessage: 'Resume Course'
    });

    const generalTag = formatMessage({
        id: 'lms.general',
        defaultMessage: 'General'
    });

    const handleGoToCourse = () => {
        history.push(`/course/${data.id}`);
    };

    const overlayEffect = isProgressTab ? (
        <div className={classes.courseOverlay}>
            <div className={classes.subscribeButtonTextContainer}>
                <img className={classes.inProgressTabIcon} src={inProgressIcon} alt="In Progress" />
                <Button className={classes.subscribeButtonOverlay} onClick={handleGoToCourse}>
                    {resumeCourseText}
                </Button>
            </div>
        </div>
    ) : (
        <div className={isProgressCourse ? classes.courseOverlayInProgress : classes.courseOverlay}>
            {isProgressCourse ? (
                <div className={classes.subscribeButtonTextContainer}>
                    <img className={classes.inProgressIcon} src={inProgressIcon} alt="In Progress" />
                    <Button className={classes.subscribeButtonOverlay} onClick={handleGoToCourse}>
                        {resumeCourseText}
                    </Button>
                </div>
            ) : (
                <Button className={classes.subscribeButtonOverlay} onClick={handleGoToCourse}>
                    {startCourseText}
                </Button>
            )}
        </div>
    );

    const categoryTag =
        data.categoryname !== '' ? (
            <span className={classes.categoryTag}>{data.categoryname}</span>
        ) : (
            <span className={classes.categoryTag}>{generalTag}</span>
        );

    const courseLogo =
        data.overviewfiles.length !== 0 ? (
            <img
                className={classes.courseImage}
                src={`${data.overviewfiles[0].fileurl}?token=af547e6e35fca251a48ff4bedb7f1298`}
                alt="Course logo"
            />
        ) : (
            <img className={classes.courseImage} src={noImageAvailable} alt="Course logo not available" />
        );

    const progressBar = (
        <div className={classes.progressBarContainer}>
            <div className={classes.progressBar}>
                <span className={classes.progressBarFill} style={{ width: `${data.progress?.toFixed(2)}%` }}>
                    <div className={classes.progressBarFillContainer}>
                        <span className={classes.progressBarFillText}>{`${data.progress?.toFixed(2)} %`}</span>
                    </div>
                </span>
            </div>
        </div>
    );

    return (
        <div key={data.id} className={classes.courseContainer}>
            {overlayEffect}
            {isProgressTab ? null : categoryTag}
            {courseLogo}
            {isProgressTab ? progressBar : null}
            <p className={classes.courseTitle}>{data.fullname}</p>
            <div className={classes.courseDescriptionContainer}>
                <p className={classes.courseDescription}>{data.summary}</p>
            </div>
            <div className={classes.subscribeButtonContainer}>
                <Button className={classes.subscribeButton} onClick={handleGoToCourse}>
                    {isProgressCourse || isProgressTab ? resumeCourseText : startCourseText}
                </Button>
            </div>
        </div>
    );
};

export default CourseItem;
