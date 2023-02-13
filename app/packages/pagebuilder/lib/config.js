import { useUserContext } from '@magento/peregrine/lib/context/user';
import React from 'react';

import { BannerShimmer } from './ContentTypes/Banner';
import bannerConfigAggregator from './ContentTypes/Banner/configAggregator';
import blockConfigAggregator from './ContentTypes/Block/configAggregator';
import ButtonItem from './ContentTypes/ButtonItem';
import buttonItemConfigAggregator from './ContentTypes/ButtonItem/configAggregator';
import buttonsConfigAggregator from './ContentTypes/Buttons/configAggregator';
import Column from './ContentTypes/Column';
import columnConfigAggregator from './ContentTypes/Column/configAggregator';
import ColumnGroup from './ContentTypes/ColumnGroup';
import columnGroupConfigAggregator from './ContentTypes/ColumnGroup/configAggregator';
import courseSliderConfigAggregator from './ContentTypes/CourseSlider/configAggregator';
import dividerConfigAggregator from './ContentTypes/Divider/configAggregator';
import { DynamicBlockShimmer } from './ContentTypes/DynamicBlock';
import dynamicBlockConfigAggregator from './ContentTypes/DynamicBlock/configAggregator';
import Heading from './ContentTypes/Heading';
import headingConfigAggregator from './ContentTypes/Heading/configAggregator';
import htmlConfigAggregator from './ContentTypes/Html/configAggregator';
import { ImageShimmer } from './ContentTypes/Image';
import imageConfigAggregator from './ContentTypes/Image/configAggregator';
import mapConfigAggregator from './ContentTypes/Map/configAggregator';
import productsConfigAggregator from './ContentTypes/Products/configAggregator';
import Row from './ContentTypes/Row';
import rowConfigAggregator from './ContentTypes/Row/configAggregator';
import { SliderShimmer } from './ContentTypes/Slider';
import sliderConfigAggregator from './ContentTypes/Slider/configAggregator';
import tabItemConfigAggregator from './ContentTypes/TabItem/configAggregator';
import tabsConfigAggregator from './ContentTypes/Tabs/configAggregator';
import Text from './ContentTypes/Text';
import textConfigAggregator from './ContentTypes/Text/configAggregator';
import videoConfigAggregator from './ContentTypes/Video/configAggregator';

/* istanbul ignore next */
const contentTypesConfig = {
	'row': {
		configAggregator: rowConfigAggregator,
		component: Row
	},
	'column': {
		configAggregator: columnConfigAggregator,
		component: Column
	},
	'column-group': {
		configAggregator: columnGroupConfigAggregator,
		component: ColumnGroup
	},
	'image': {
		configAggregator: imageConfigAggregator,
		component: React.lazy(() => import('./ContentTypes/Image')),
		componentShimmer: ImageShimmer
	},
	'heading': {
		configAggregator: headingConfigAggregator,
		component: Heading
	},
	'text': {
		configAggregator: textConfigAggregator,
		component: Text
	},
	'tabs': {
		configAggregator: tabsConfigAggregator,
		component: React.lazy(() => import('./ContentTypes/Tabs'))
	},
	'tab-item': {
		configAggregator: tabItemConfigAggregator,
		component: React.lazy(() => import('./ContentTypes/TabItem'))
	},
	'buttons': {
		configAggregator: buttonsConfigAggregator,
		component: React.lazy(() => import('./ContentTypes/Buttons'))
	},
	'button-item': {
		configAggregator: buttonItemConfigAggregator,
		component: ButtonItem
	},
	'block': {
		configAggregator: blockConfigAggregator,
		component: React.lazy(() => import('./ContentTypes/Block'))
	},
	'dynamic_block': {
		configAggregator: dynamicBlockConfigAggregator,
		component: React.lazy(() => import('./ContentTypes/DynamicBlock')),
		componentShimmer: DynamicBlockShimmer
	},
	'products': {
		configAggregator: productsConfigAggregator,
		component: React.lazy(() => import('./ContentTypes/Products'))
	},
	'html': {
		configAggregator: htmlConfigAggregator,
		component: React.lazy(() => import('./ContentTypes/Html'))
	},
	'divider': {
		configAggregator: dividerConfigAggregator,
		component: React.lazy(() => import('./ContentTypes/Divider'))
	},
	'video': {
		configAggregator: videoConfigAggregator,
		component: React.lazy(() => import('./ContentTypes/Video'))
	},
	'map': {
		configAggregator: mapConfigAggregator,
		component: React.lazy(() => import('./ContentTypes/Map'))
	},
	'banner': {
		configAggregator: bannerConfigAggregator,
		component: React.lazy(() => import('./ContentTypes/Banner')),
		componentShimmer: BannerShimmer
	},
	'slider': {
		configAggregator: sliderConfigAggregator,
		component: React.lazy(() => import('./ContentTypes/Slider')),
		componentShimmer: SliderShimmer
	},
	// Slide is just a banner wrapped inside a slider
	'slide': {
		configAggregator: bannerConfigAggregator,
		component: React.lazy(() => import('./ContentTypes/Banner')),
		componentShimmer: BannerShimmer
	}
};

const addLmsContentType = () => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [{ isSignedIn }] = useUserContext();

	if (process.env.LMS_ENABLED === 'true' && isSignedIn) {
		contentTypesConfig['pagebuilder_lms'] = {
			configAggregator: courseSliderConfigAggregator,
			component: React.lazy(() => import('./ContentTypes/CourseSlider'))
		};
	}
};

/**
 * Retrieve a content types configuration
 *
 * @param {string} contentType
 * @returns {*}
 */
export function getContentTypeConfig(contentType) {
	addLmsContentType();

	if (contentTypesConfig[contentType]) {
		return contentTypesConfig[contentType];
	}
}

/**
 * Set content types configuration with new one
 *
 * @param {string} contentType
 * @param {*} config
 * @returns {*}
 */
export function setContentTypeConfig(contentType, config) {
	addLmsContentType();

	return (contentTypesConfig[contentType] = config);
}
