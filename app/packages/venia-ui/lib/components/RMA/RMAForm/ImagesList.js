import React, { useEffect, useRef } from 'react';
import { useRMAFormContext } from '../RMAForm/RMAFormProvider/RMAFormProvider';

const ImagesList = () => {
    const { files } = useRMAFormContext();
    const imageRef = useRef();

    const thumbs = files.map(file => (
        <div key={file.name} ref={imageRef}>
            <img src={file.preview} alt={file.name} />
        </div>
    ));

    useEffect(
        () => () => {
            files.forEach(file => URL.revokeObjectURL(file.preview));
        },
        [files]
    );

    return <aside>{thumbs}</aside>;
};

export default ImagesList;
