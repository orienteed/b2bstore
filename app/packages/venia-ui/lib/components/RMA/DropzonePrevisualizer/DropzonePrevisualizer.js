import React, { useState } from 'react';
import defaultClasses from './DropzonePrevisualizer.module.css';
import TextInput from '../../TextInput';
import ImagesList from './ImagesList';
import { useStyle } from '../../../classify';
import { useIntl } from 'react-intl';
import Trigger from '../../Trigger';
import Dropzone from './Dropzone/dropzone';
import Icon from '../../Icon';
import { Smile as EmojiPickerIcon } from 'react-feather';

const DropzonePrevisualizer = props => {
    const [filesUploaded, setFilesUploaded] = useState([]);
    const [dropzoneError, setDropzoneError] = useState('');
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const attachmentButton = (
        <Trigger action={() => {}}>
            <Dropzone
                filesUploaded={filesUploaded}
                setFilesUploaded={setFilesUploaded}
                setDropzoneError={setDropzoneError}
            />
        </Trigger>
    );
    const emojiPickerButton = (
        <Trigger action={() => {}}>
            {isEmojiPickerOpen ? (
                <img className={classes.emojiPickerIcon} src={closeIcon} alt="Close icon" />
            ) : (
                <Icon src={EmojiPickerIcon} size={25} classes={classes.emojiPickerIconEnabled} />
            )}
        </Trigger>
    );

    const handleClose = file => {
        const newFilesUploaded = [...filesUploaded].filter(({ name }) => name != file.name);
        setFilesUploaded(newFilesUploaded);
    };

    const defaultTextDropzone = formatMessage({
        id: 'rmaRequestForm.orderDefaultTextDropzone',
        defaultMessage: 'Drag and drop your images'
    });

    return (
        <>
            <div className={classes.dropZoneContainer}>
                <TextInput
                    disabled
                    id="chatTextInput"
                    field="dropzone"
                    placeholder={formatMessage({
                        id: 'rmaRequestForm.attachYourImgs',
                        defaultMessage: 'Attach your images'
                    })}
                    before={emojiPickerButton}
                    maxLength={10000}
                    after={attachmentButton}
                    supportEmoji={true}
                    value={defaultTextDropzone}
                    classes={classes.dropZone}
                    autoComplete="off"
                />
            </div>
            <ImagesList filesUploaded={filesUploaded} handleClose={handleClose} />
        </>
    );
};

export default DropzonePrevisualizer;
