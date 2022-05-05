import React from 'react';
import { FormattedMessage } from 'react-intl';

import ContentDialog from '../ContentDialog/contentDialog';

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

    const { userMoodleId, userMoodleToken } = useCoursesCatalog();
    const { isDone, setIsDone, isModalOpen, setIsModalOpen } = useCourseModuleContent({
        completiondata: courseModule.completiondata
    });

    const handleOpenPopUp = () => {
        setIsModalOpen(true);
    };

    const handleClosePopUp = () => {
        setIsModalOpen(false);
    };

    const handleDownload = () => {
        fetch(`${courseModule.contents[0].fileurl}&token=${userMoodleToken}`)
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = courseModule.contents[0].filename;
                link.click();
            })
            .catch(console.error);
    };

    const handleMarkAsDone = () => {
        markAsDone(userMoodleId, courseModule.id).then(reply => (reply ? setIsDone(true) : null));
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
                            <button className={classes.actionIcons} onClick={() => handleOpenPopUp()}>
                                <img src={viewIcon} alt="View" />
                            </button>
                            <button className={classes.actionIcons} onClick={() => handleDownload()}>
                                <img src={downloadIcon} alt="Download" />
                            </button>
                            {markAsDoneButton()}
                        </div>
                    );
                case 'url': {
                    return (
                        <div className={classes.courseContentContainerLeft}>
                            <a className={classes.actionIcons} href={contentFile.fileurl} target="_blank">
                                <img src={viewIcon} alt="Visit" />
                            </a>
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
                    <ContentDialog
                    dialogName = {courseModule.name}
                        url={`${courseModule.contents[0].fileurl}&token=${userMoodleToken}`}
                        contentFile={courseModule.contents[0]}
                        isModalOpen={isModalOpen}
                        handleClosePopUp={handleClosePopUp}
                        handleDownload={handleDownload}
                    />
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
