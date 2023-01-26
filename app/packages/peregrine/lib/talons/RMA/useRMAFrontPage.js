import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/client';
import { REQUEST_CONVERSATION } from './RMA.gql';

const useRMAFrontPage = props => {
    const { refetchRequest } = props;
    const [openPopup, setOpenPopup] = useState(false);
    const [filesUploaded, setFilesUploaded] = useState([]);
    const [selectedItem, setSelectedItem] = useState();
    const [comment, setComment] = useState('');

    const [requestConversation, { loading }] = useMutation(REQUEST_CONVERSATION);

    const handleOpenPopup = item => {
        setOpenPopup(true);
        setSelectedItem(item);
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
    };
    const handleSubmitConversation = useCallback(
        request_id => {
            if (filesUploaded && comment) {
                try {
                    console.log({ filesUploaded, comment });
                    requestConversation({
                        variables: {
                            request_id,
                            content: comment,
                            upload: filesUploaded
                        }
                    });
                } catch (error) {
                    console.log({ error });
                }
            }
        },
        [filesUploaded, comment, requestConversation]
    );

    return {
        handleOpenPopup,
        handleClosePopup,
        selectedItem,
        openPopup,
        filesUploaded,
        setFilesUploaded,
        handleSubmitConversation,
        setComment
    };
};

export default useRMAFrontPage;
