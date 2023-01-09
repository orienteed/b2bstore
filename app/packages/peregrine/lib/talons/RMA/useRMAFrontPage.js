import React, { useState } from 'react';

const useRMAFrontPage = () => {
    const [openPopup, setOpenPopup] = useState(false);
    const handleOpenPopup = () => {
        setOpenPopup(true);
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
    };

    return {
        handleOpenPopup,
        handleClosePopup,
        openPopup
    };
};

export default useRMAFrontPage;
