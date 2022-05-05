import { useState, useEffect } from 'react';

export const useCourseModuleContent = props => {
    const { completiondata } = props;
    const [isDone, setIsDone] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        completiondata?.state === 0 ? setIsDone(false) : setIsDone(true);
    }, [completiondata]);

    return { isDone, setIsDone, isModalOpen, setIsModalOpen };
};
