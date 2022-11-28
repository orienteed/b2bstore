import { shape, string } from 'prop-types';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useShareCartPage } from '@orienteed/buyLaterNotes/talons/useShareCartPage';

const ShareCartPage = () => {
    const talonProps = useShareCartPage();

    const { isLoading } = talonProps;

    if (isLoading) {
        return fullPageLoadingIndicator;
    }

    return null;
};

export default ShareCartPage;

ShareCartPage.propTypes = {
    classes: shape({
        root: string,
        heading: string,
        content: string
    })
};
