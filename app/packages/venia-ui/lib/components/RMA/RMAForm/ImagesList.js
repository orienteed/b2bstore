import React, { useEffect, useRef } from 'react';
import { useRMAFormContext } from '../RMAForm/RMAFormProvider/RMAFormProvider';
import { useStyle } from '../../../classify';
import { X as CloseIcon } from 'react-feather';
import defaultClasses from './ImagesList.module.css';
import Icon from '../../Icon';
import Button from '../../Button';

const ImagesList = props => {
    const { filesUploaded, handleClose } = props;
    const classes = useStyle(defaultClasses);
    const { files } = useRMAFormContext();
    const imageRef = useRef();
    const thumbs = filesUploaded?.map(file => (
        <div className={classes.imageWrap} key={file.name} ref={imageRef}>
            <img className={classes.previewImg} src={file.content} alt={file.name} />
            <Button classes={classes.deleteBtn} priority={'high'} onClick={() => handleClose(file)}>
                <Icon classes={classes.deleteIcon} src={CloseIcon} />
            </Button>
        </div>
    ));

    useEffect(
        () => () => {
            files.forEach(file => URL.revokeObjectURL(file.preview));
        },
        [files]
    );

    return (
        <aside>
            <div className={classes.imagesContainer}>{thumbs}</div>
        </aside>
    );
};

export default ImagesList;
