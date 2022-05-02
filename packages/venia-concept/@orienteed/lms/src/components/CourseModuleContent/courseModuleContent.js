import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { useCoursesCatalog } from '../../talons/useCoursesCatalog';
import { useCourseModuleContent } from '../../talons/useCourseModuleContent';

import defaultClasses from './courseModuleContent.module.css';

import markAsDone from '../../../services/markAsDone';

import audioIcon from './Icons/audio.svg';
import checkFillIcon from './Icons/checkFill.svg';
import checkNoFillIcon from './Icons/checkNoFill.svg';
import downloadIcon from './Icons/download.svg';
import fileIcon from './Icons/file.svg';
import imageIcon from './Icons/image.svg';
import infoIcon from './Icons/info.svg';
import notFoundIcon from './Icons/notFound.svg';
import pdfIcon from './Icons/pdf.svg';
import urlIcon from './Icons/url.svg';
import videoIcon from './Icons/video.svg';
import viewIcon from './Icons/view.svg';

const CourseModuleContent = props => {
    const { courseModule, isEnrolled } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const { userMoodleId } = useCoursesCatalog();
    const { isDone, setIsDone } = useCourseModuleContent({ completiondata: courseModule.completiondata });

    const handleMarkAsDone = () => {
        markAsDone(userMoodleId, courseModule.id).then(reply => (reply ? setIsDone(true) : null));
    };

    const handleOpenPopUp = url => {
        console.log(`Opening ${url}`);
    };

    const handleDownload = url => {
        console.log(`Downloading ${url}`);
    };

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

    const markAsDoneButton = () => {
        return isDone ? (
            <img src={checkFillIcon} className={classes.actionIconsDisabled} alt="Done" />
        ) : (
            <button className={classes.actionIcons} onClick={() => handleMarkAsDone()}>
                <img src={checkNoFillIcon} alt="Mark as done" />
            </button>
        );
    };

    const actionContentButtons = contentFile => {
        if (isEnrolled) {
            switch (contentFile.type) {
                case 'file':
                    return (
                        <div className={classes.courseContentContainerLeft}>
                            <button
                                className={classes.actionIcons}
                                onClick={() =>
                                    handleOpenPopUp(`${contentFile.fileurl}&token=af547e6e35fca251a48ff4bedb7f1298`)
                                }
                            >
                                <img src={viewIcon} alt="View" />
                            </button>
                            <button
                                className={classes.actionIcons}
                                onClick={() =>
                                    handleDownload(`${contentFile.fileurl}&token=af547e6e35fca251a48ff4bedb7f1298`)
                                }
                            >
                                <img src={downloadIcon} alt="Download" />
                            </button>
                            {markAsDoneButton()}
                        </div>
                    );
                case 'url': {
                    return (
                        <div className={classes.courseContentContainerLeft}>
                            <button
                                className={classes.actionIcons}
                                onClick={() => handleOpenPopUp(contentFile.fileurl)}
                            >
                                <img src={viewIcon} alt="Visit" />
                            </button>
                            {markAsDoneButton()}
                        </div>
                    );
                }
            }
        }
    };

    return (
        <div className={classes.courseContentContainer} key={courseModule.id}>
            {courseModule.hasOwnProperty('contents') ? (
                <>
                    <div className={classes.courseContentContainerLeft}>
                        <img
                            src={selectIcon(courseModule.contents[0])}
                            className={classes.courseContentIcon}
                            alt="file type icon"
                        />
                        <p className={classes.moduleTitle}>{courseModule.name}</p>
                        {courseModule.hasOwnProperty('description') && (
                            <img src={infoIcon} className={classes.courseContentIcon} alt={courseModule.description} />
                        )}
                    </div>
                    {actionContentButtons(courseModule.contents[0])}
                </>
            ) : (
                <div className={classes.courseContentContainerLeft}>
                    <img src={notFoundIcon} width="30" alt="not found icon" />
                    <span>
                        <FormattedMessage id={'lms.notFound'} defaultMessage={'Content not available'} />
                    </span>
                </div>
            )}
        </div>
    );
};

export default CourseModuleContent;
