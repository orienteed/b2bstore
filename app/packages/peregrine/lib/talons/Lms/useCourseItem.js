import getCoursePreviewMedia from '@magento/peregrine/lib/RestApi/Lms/media/getCoursePreviewMedia';
import { useEffect, useState } from 'react';

export const useCourseItem = props => {
	const { courseImageUri, courseModuleMimetype } = props;
	const [coursePreviewUrl, setCoursePreviewUrl] = useState('');

	useEffect(() => {
		if (courseImageUri) {
			getCoursePreviewMedia(courseImageUri)
				.then(response => response.arrayBuffer())
				.then(data =>
					setCoursePreviewUrl(URL.createObjectURL(new Blob([data], { type: courseModuleMimetype })))
				)
				.catch(err => console.error(err));
		}
	}, [courseImageUri, courseModuleMimetype]);

	return { coursePreviewUrl };
};
