import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { FormattedMessage, useIntl } from 'react-intl';
import defaultClasses from './courseItem.module.css';
import noImageAvailable from './Icons/noImageAvailable.svg';
import Button from '@magento/venia-ui/lib/components/Button';

const CourseItem = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const { data } = props;
    const handleSubscription = () => {
        console.log(`Suscrito a ${data.fullname}`);
    };

    return (
        <div className={classes.courseContainer}>
            <div className={classes.card__overlay}>
                <Button
                    className={classes.subscribeButtonOverlay}
                    onClick={handleSubscription}
                >
                    <FormattedMessage
                        id={'moodleCourse.suscribeButton'} // TODO_B2B: Translations
                        defaultMessage={'Suscribirse'}
                    />
                </Button>
            </div>
            {data.categoryname !== '' ? (
                <span className={classes.categoryTag}>{data.categoryname}</span>
            ) : (
                <span className={classes.categoryTag}>General</span>
            )}
            {data.overviewfiles.length !== 0 ? (
                <img
                    className={classes.courseImage}
                    src={`${
                        data.overviewfiles[0].fileurl
                    }?token=af547e6e35fca251a48ff4bedb7f1298`}
                    alt='Course logo'
                />
            ) : (
                <img className={classes.courseImage} src={noImageAvailable} alt='Course logo not available'/>
            )}
            <p className={classes.courseTitle}>{data.fullname}</p>
            <div className={classes.courseDescriptionContainer}>
                <p className={classes.courseDescription}>{data.summary}</p>
            </div>
            <div className={classes.subscribeButtonContainer}>
                <Button
                    className={classes.subscribeButton}
                    onClick={handleSubscription}
                >
                    <FormattedMessage
                        id={'moodleCourse.suscribeButton'}
                        defaultMessage={'Suscribirse'}
                    />
                </Button>
            </div>
        </div>
    );
};

export default CourseItem;
