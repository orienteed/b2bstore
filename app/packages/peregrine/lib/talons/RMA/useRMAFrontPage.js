/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/client';
import { REQUEST_CONVERSATION } from './RMA.gql';

const useRMAFrontPage = props => {
    const { refetchRequest, requestsList } = props;
    const [openPopup, setOpenPopup] = useState(false);
    const [filesUploaded, setFilesUploaded] = useState([]);
    const [selectedItem, setSelectedItem] = useState();
    const [comment, setComment] = useState('');
    const [isSubmit, setIsSubmit] = useState(false);
    const [requestConversation] = useMutation(REQUEST_CONVERSATION);

    const handleOpenPopup = item => {
        setOpenPopup(true);
        setSelectedItem(item);
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
    };

    const handleSubmitConversation = useCallback(
        request_id => {
            setIsSubmit(true);
            if (filesUploaded && comment) {
                try {
                    requestConversation({
                        variables: {
                            request_id,
                            content: comment,
                            upload: [...filesUploaded].map(ele => {
                                return { base64_encoded_data: ele.base64_encoded_data.split(',')[1], name: ele.name };
                            })
                        }
                    });

                    setTimeout(() => {
                        refetchRequest();
                    }, 2000);
                    // setFilesUploaded([]);
                    // setComment('');
                    setIsSubmit(false);
                } catch (error) {
                    console.log({ error });
                }
            }
        },
        [filesUploaded, comment, requestConversation, requestsList]
    );

    return {
        handleOpenPopup,
        handleClosePopup,
        selectedItem,
        openPopup,
        filesUploaded,
        setFilesUploaded,
        handleSubmitConversation,
        isSubmit,
        setComment,
        comment
    };
};

export default useRMAFrontPage;
