import React from 'react';
import CmsBlock from '@magento/venia-ui/lib/components/CmsBlock/block';
import { useCmsBlock } from '@magento/venia-concept/src/talons/useCmsBlocks';
import { useUserContext } from '@magento/peregrine/lib/context/user';

const SubHeader = () => {
    const [{ isSignedIn: isUserSignedIn }] = useUserContext();
    const { cmsBlocks } = useCmsBlock({ cmsBlockIdentifiers: ['ads_banner'] });
    const adsBannerBlock = cmsBlocks.find(item => item.identifier === 'ads_banner')?.content;
    return (
        <main>
            {isUserSignedIn && adsBannerBlock && (
                <article>
                    <CmsBlock content={adsBannerBlock} />
                </article>
            )}
        </main>
    );
};

export default SubHeader;
