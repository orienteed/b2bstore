import React, { useState, useContext } from 'react';

const RMAFormContext = React.createContext();

export const RMAFormProvider = ({ children }) => {
    const [files, setFiles] = useState([]);

    return (
        <RMAFormContext.Provider
            value={{
                files,
                setFiles
            }}
        >
            {children}
        </RMAFormContext.Provider>
    );
};

export const useRMAFormContext = () => {
    return useContext(RMAFormContext);
};
