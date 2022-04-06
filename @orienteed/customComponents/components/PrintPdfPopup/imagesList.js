import React, { useEffect, useRef } from 'react';
import { useCustomContext } from './CustomProvider/customProvider';

const imagesList = () => {
    const { files } = useCustomContext();
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

export default imagesList;
