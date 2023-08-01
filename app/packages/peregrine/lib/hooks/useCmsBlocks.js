import { useMemo } from 'react';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

export const useCmsBlock = props => {
    const { cmsBlockIdentifiers = [] } = props;

    const { getCmsBlocks } = useAdapter();
    const { data: cmsBlocksData, loading: cmsBlocksLoading } = getCmsBlocks({
        identifiers: cmsBlockIdentifiers
    });

    const cmsBlocks = useMemo(() => {
        return cmsBlocksData?.cmsBlocks?.items || [];
    }, [cmsBlocksData]);

    return { cmsBlocks, cmsBlocksLoading };
};
