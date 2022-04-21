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
import audioIcon from './Icons/audio.svg';
import fileIcon from './Icons/file.svg';
import imageIcon from './Icons/image.svg';
import pdfIcon from './Icons/pdf.svg';
import urlIcon from './Icons/url.svg';
import videoIcon from './Icons/video.svg';
import infoIcon from './Icons/info.svg';
import notFoundIcon from './Icons/notFound.svg';

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

    console.log(courseContent);

    useEffect(() => {
        getCourseDetails(courseId).then(reply => setCourseDetails(reply.courses[0]));
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
            <span className={classes.currentPage}>{courseDetails.fullname}</span>
        </div>
    );

    const selectIcon = mimetype => {
        switch (mimetype.split('/')[0]) {
            case 'audio':
                return audioIcon;
            case 'video':
                return videoIcon;
            case 'application':
                return pdfIcon;
            case 'image':
                return imageIcon;
            case 'url':
                return urlIcon;
            default:
                return fileIcon;
        }
    };

    const showCourseModules = course => {
        return (
            <div className={classes.courseSectionContainer}>
                <p className={classes.sectionTitle}>{course.name}</p>
                {course.modules.map(module => {
                    return (
                        <div className={classes.courseContentContainer} key={module.id}>
                            {module.hasOwnProperty('contents') ? (
                                <div className={classes.courseContentContainerLeft}>
                                    <img
                                        src={selectIcon(module?.contents[0].mimetype)}
                                        className={classes.courseContentIcon}
                                        alt="file type icon"
                                    />
                                    <p className={classes.moduleTitle}>{module.name}</p>
                                    {module.hasOwnProperty('description') && (
                                        <img
                                            src={infoIcon}
                                            className={classes.courseContentIcon}
                                            alt={module.description}
                                        />
                                    )}
                                </div>
                            ) : (
                                <div className={classes.courseContentContainerLeft}>
                                    <img
                                        src={notFoundIcon}
                                        width="50"
                                        alt="not found icon"
                                    />
                                    <span>
                                        <FormattedMessage
                                            id={'lms.notfound'} // TODO_B2B: Translations
                                            defaultMessage={'Content not available'}
                                        />
                                    </span>
                                </div>
                            )}
                        </div>
                    );
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
                        <div>
                            <p className={classes.courseTitle}>{courseDetails.fullname}</p>
                            <p className={classes.summaryText}>{courseDetails.summary}</p>
                        </div>
                    </div>
                )}
                {courseContent !== undefined && (
                    <>
                        <span className={classes.contentTitle}>
                            <FormattedMessage
                                id={'learning.content'} // TODO_B2B: Translations
                                defaultMessage={'Content'}
                            />
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
