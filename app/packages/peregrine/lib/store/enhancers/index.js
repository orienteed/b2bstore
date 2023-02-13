import composeEnhancers from '../../util/composeEnhancers';
import errorHandler from './errorHandler';
import middleware from './middleware';

const enhancer = composeEnhancers(middleware, errorHandler);

export default enhancer;
