import { useState, useEffect, useCallback } from 'react';
import { Magento2 } from '@magento/peregrine/lib/RestApi';

export const useCourseModuleContent = props => {
    const { courseModuleUri, courseModuleMimetype, completiondata, isEnrolled } = props;

    const [courseModuleUrl, setCourseModuleUrl] = useState('');
    const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getCourseModuleMedia = useCallback(async courseModuleUri => {
        const { request } = Magento2;

        const reply = await request(`/lms/api/v1/media/resource?uri=${courseModuleUri}`, {
            method: 'GET',
            parseJSON: false,
            credentials: 'include'
        });

        return reply;
    }, []);

    useEffect(() => {
        if (isEnrolled && courseModuleUri) {
            getCourseModuleMedia(courseModuleUri)
                .then(response => response.arrayBuffer())
                .then(data => setCourseModuleUrl(URL.createObjectURL(new Blob([data], { type: courseModuleMimetype }))))
                .catch(err => console.error(err));
        }
    }, [isEnrolled, courseModuleUri, courseModuleMimetype, getCourseModuleMedia]);

    useEffect(() => {
        completiondata?.state === 0 ? setIsDone(false) : setIsDone(true);
    }, [completiondata]);

    return {
        courseModuleUrl,
        isConfirmationModalOpen,
        isDone,
        isModalOpen,
        setConfirmationModalOpen,
        setIsDone,
        setIsModalOpen
    };
};
