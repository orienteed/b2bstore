import { getAdvanced, getBackgroundImages, getMediaQueries, getVerticalAlignment } from '../../utils';

export default node => {
	return {
		minHeight: node.style.minHeight ? node.style.minHeight : null,
		display: node.style.display,
		width: node.style.width,
		backgroundColor: node.style.backgroundColor,
		...getMediaQueries(node),
		...getAdvanced(node),
		...getBackgroundImages(node),
		...getVerticalAlignment(node)
	};
};
