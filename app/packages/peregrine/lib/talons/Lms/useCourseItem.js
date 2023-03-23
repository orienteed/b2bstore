import { useState, useEffect, useCallback } from 'react';
import { Magento2 } from '@magento/peregrine/lib/RestApi';

export const useCourseItem = props => {
    const { courseImageUri, courseModuleMimetype } = props;
    const [coursePreviewUrl, setCoursePreviewUrl] = useState('');

    const getCoursePreviewMedia = useCallback(async courseImageUri => {
        const { request } = Magento2;

        const reply = await request(`/lms/api/v1/media/course?uri=${courseImageUri}`, {
            method: 'GET',
            parseJSON: false,
            credentials: 'include'
        });

        return reply;
    }, []);

    useEffect(() => {
        if (courseImageUri) {
            getCoursePreviewMedia(courseImageUri)
                .then(response => response.arrayBuffer())
                .then(data =>
                    setCoursePreviewUrl(URL.createObjectURL(new Blob([data], { type: courseModuleMimetype })))
                )
                .catch(err => console.error(err));
        }
    }, [courseImageUri, courseModuleMimetype, getCoursePreviewMedia]);

    return { coursePreviewUrl };
};
