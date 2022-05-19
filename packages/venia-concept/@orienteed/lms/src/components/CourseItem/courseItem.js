import React from 'react';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';

import Button from '@magento/venia-ui/lib/components/Button';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './courseItem.module.css';
import noImageAvailable from './Icons/noImageAvailable.svg';

const CourseItem = props => {
    const { data, isProgressCourse, isProgressTab } = props;
    const classes = useStyle(defaultClasses, props.classes);

    isProgressTab && console.log(data);

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

    // TODO_B2B: Add translation for 'In Progress'
    const categoryTag =
        data.categoryname !== '' ? (
            <span className={classes.categoryTag}>
                {isProgressCourse ? `${data.categoryname} | In progress` : data.categoryname}
            </span>
        ) : (
            <span className={classes.categoryTag}>{isProgressCourse ? `${generalTag} | In progress` : generalTag}</span>
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

    const progressBar = () => {
        const progressNumber = data.progress !== null ? data.progress.toFixed(2) : (0).toFixed(2);
        const progressText = `${progressNumber} %`;

        return (
            <div className={classes.progressBarContainer}>
                <div className={classes.progressBar}>
                    <div className={classes.progressBarFill} style={{ width: `${progressNumber}%` }}>
                        <div className={classes.progressBarFillContainer}>
                            <span className={classes.progressBarFillText}>{progressText}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <article key={data.id} className={classes.courseContainer}>
            {courseLogo}
            <div className={classes.courseBody}>
                <h1 className={classes.courseTitle}>{data.fullname}</h1>
                {isProgressTab ? null : categoryTag}
                {isProgressTab ? progressBar() : null}
                <p className={classes.courseDescription}>{data.summary}</p>
                <div className={classes.actionButtonContainer}>
                    <Button className={classes.actionButton} onClick={handleGoToCourse}>
                        {isProgressCourse || isProgressTab ? resumeCourseText : startCourseText}
                    </Button>
                </div>
            </div>
        </article>
    );
};

export default CourseItem;
