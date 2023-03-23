import React, { useState, useContext } from 'react';
import getCourses from '@magento/peregrine/lib/RestApi/Lms/courses/getCourses';
import getUserCourses from '@magento/peregrine/lib/RestApi/Lms/courses/getUserCourses';

const LMSContext = React.createContext();

export const LMSProvider = ({ children }) => {
    const [courses, setCourses] = useState();
    const [userCourses, setUserCourses] = useState();

    return (
        <LMSContext.Provider
            value={{
                courses,
                setCourses,
                userCourses,
                setUserCourses,
                getCourses,
                getUserCourses
            }}
        >
            {children}
        </LMSContext.Provider>
    );
};

export const useLMSContext = () => {
    return useContext(LMSContext);
};
