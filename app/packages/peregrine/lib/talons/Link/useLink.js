import { useEffect, useRef } from 'react';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import resourceUrl from '../../util/makeUrl';

const useLink = (props, passedOperations = {}) => {
    const { innerRef: originalRef, to } = props;
    const shouldPrefetch = props.prefetchType || props.shouldPrefetch;

    const intersectionObserver = useIntersectionObserver();
    const { resolveURL } = useAdapter();
    const { runQuery, called: pageTypeCalled } = resolveURL();
    const generatedRef = useRef();
    const elementRef =
        originalRef || !shouldPrefetch ? originalRef : generatedRef;
    const linkPath = shouldPrefetch ? resourceUrl(to) : null;

    useEffect(() => {
        if (
            !shouldPrefetch ||
            pageTypeCalled ||
            !runQuery ||
            !elementRef.current ||
            !intersectionObserver
        ) {
            return;
        }

        const htmlElement = elementRef.current;

        const onIntersection = entries => {
            if (entries.some(entry => entry.isIntersecting)) {
                observer.unobserve(htmlElement);

                runQuery({
                    variables: { url: linkPath }
                });
            }
        };
        const observer = new intersectionObserver(onIntersection);
        observer.observe(htmlElement);

        return () => {
            if (htmlElement) {
                observer.unobserve(htmlElement);
            }
        };
    }, [
        shouldPrefetch,
        elementRef,
        pageTypeCalled,
        linkPath,
        intersectionObserver,
        runQuery
    ]);

    return {
        ref: elementRef
    };
};

export default useLink;
