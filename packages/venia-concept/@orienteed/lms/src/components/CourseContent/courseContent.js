import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation, useHistory, Link } from 'react-router-dom';
import { ArrowLeft as BackIcon, Check as CheckIcon } from 'react-feather';

import Icon from '@magento/venia-ui/lib/components/Icon';
import Button from '@magento/venia-ui/lib/components/Button';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useCoursesCatalog } from '../../talons/useCoursesCatalog';

import defaultClasses from './courseContent.module.css';

import getCourseContent from '../../../services/getCourseContent';
import getCourseDetails from '../../../services/getCourseDetails';
import enrollUserInCourse from '../../../services/enrollUserInCourse';
import markAsDone from '../../../services/markAsDone';

import noImageAvailable from '../CourseItem/Icons/noImageAvailable.svg';
import audioIcon from './Icons/audio.svg';
import fileIcon from './Icons/file.svg';
import imageIcon from './Icons/image.svg';
import pdfIcon from './Icons/pdf.svg';
import urlIcon from './Icons/url.svg';
import videoIcon from './Icons/video.svg';
import infoIcon from './Icons/info.svg';
import notFoundIcon from './Icons/notFound.svg';
import viewIcon from './Icons/view.svg';
import downloadIcon from './Icons/download.svg';
import checkNoFillIcon from './Icons/checkNoFill.svg';
import checkFillIcon from './Icons/checkFill.svg';

const DELIMITER = '/';

const CourseContent = props => {
    console.log(props)
    const classes = useStyle(defaultClasses, props.classes);
    const [{ isSignedIn }] = useUserContext();
    const { search } = useLocation();
    const history = useHistory();
    const talonProps = useCoursesCatalog();
    const { userMoodleToken, userMoodleId } = talonProps;

    if (!isSignedIn) {
        history.push('/');
    }

    let courseId = new URLSearchParams(search).get('id');
    const [courseDetails, setCourseDetails] = useState();
    const [courseContent, setCourseContent] = useState();
    const [enrolled, setEnrolled] = useState(false);

    useEffect(() => {
        getCourseDetails(courseId).then(reply => setCourseDetails(reply.courses[0]));
        getCourseContent(courseId).then(reply => setCourseContent(reply));
    }, [courseId]);

    const handleEnrollInCourse = () => {
        enrollUserInCourse(userMoodleId, courseId).then(reply => (reply ? setEnrolled(true) : null));
    };

    const handleMarkAsDone = courseModuleId => {
        markAsDone(userMoodleId, courseModuleId).then(reply => console.log(reply));
        courseId = new URLSearchParams(search).get('id');
    };

    const handleOpenPopUp = url => {
        console.log(`Opening ${url}`);
    };

    const handleDownload = url => {
        console.log(`Downloading ${url}`);
    };

    const breadcrumbs = courseDetails !== undefined && (
        <div className={classes.root} aria-live="polite" aria-busy="false">
            <Link className={classes.link} to="/">
                <FormattedMessage id={'global.home'} defaultMessage={'Home'} />
            </Link>
            <span className={classes.divider}>{DELIMITER}</span>
            <Link className={classes.link} to="/learning">
                <FormattedMessage
                    id={'lms.learning'} // TODO_B2B: Translations
                    defaultMessage={'Learning'}
                />
            </Link>
            <span className={classes.divider}>{DELIMITER}</span>
            <span className={classes.currentPage}>{courseDetails.fullname}</span>
        </div>
    );
    console.log(courseContent);
    const selectIcon = contentFile => {
        switch (contentFile.type) {
            case 'file': {
                switch (contentFile.mimetype.split('/')[0]) {
                    case 'audio':
                        return audioIcon;
                    case 'video':
                        return videoIcon;
                    case 'application':
                        return pdfIcon;
                    case 'image':
                        return imageIcon;
                    default:
                        return fileIcon;
                }
            }
            case 'url': {
                return urlIcon;
            }
            default: {
                return fileIcon;
            }
        }
    };

    const markAsDoneButton = (id, completionData) => {
        return completionData === 0 ? (
            <img src={checkNoFillIcon} className={classes.actionIcons} onClick={() => handleMarkAsDone(id)} />
        ) : (
            <img src={checkFillIcon} className={classes.actionIconsDisabled} />
        );
    };

    const actionContentButtons = (id, contentFile, completionData) => {
        if (enrolled) {
            switch (contentFile.type) {
                case 'file':
                    return (
                        <div className={classes.courseContentContainerLeft}>
                            <img
                                src={viewIcon}
                                className={classes.actionIcons}
                                onClick={() =>
                                    handleOpenPopUp(`${contentFile.fileurl}&token=af547e6e35fca251a48ff4bedb7f1298`)
                                }
                            />
                            <img
                                src={downloadIcon}
                                className={classes.actionIcons}
                                onClick={() =>
                                    handleDownload(`${contentFile.fileurl}&token=af547e6e35fca251a48ff4bedb7f1298`)
                                }
                            />
                            {markAsDoneButton(id, completionData.state)}
                        </div>
                    );
                case 'url': {
                    return (
                        <div className={classes.courseContentContainerLeft}>
                            <img
                                src={viewIcon}
                                className={classes.actionIcons}
                                onClick={() => handleOpenPopUp(contentFile.fileurl)}
                            />
                            {markAsDoneButton(id, completionData.state)}
                        </div>
                    );
                }
            }
        }
    };

    const showCourseModules = course => {
        return (
            <div key={course.id} className={classes.courseSectionContainer}>
                <p className={classes.sectionTitle}>{course.name}</p>
                {course.modules.map(module => {
                    return (
                        <div className={classes.courseContentContainer} key={module.id}>
                            {module.hasOwnProperty('contents') ? (
                                <>
                                    <div className={classes.courseContentContainerLeft}>
                                        <img
                                            src={selectIcon(module.contents[0])}
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
                                    {actionContentButtons(module.id, module.contents[0], module.completiondata)}
                                </>
                            ) : (
                                <div className={classes.courseContentContainerLeft}>
                                    <img src={notFoundIcon} width="30" alt="not found icon" />
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
                                            <Icon src={CheckIcon} size={20} classes={{ icon: classes.checkIcon }} />
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
                            <FormattedMessage
                                id={'lms.content'} // TODO_B2B: Translations
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
