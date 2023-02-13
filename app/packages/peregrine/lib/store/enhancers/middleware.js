import { applyMiddleware } from 'redux';

import auth from '../middleware/auth';
import log from '../middleware/log';
import restrictedAuthPage from '../middleware/restrictedAuthPage';
import thunk from '../middleware/thunk';

const middleware = [thunk, auth, restrictedAuthPage];

if (process.env.NODE_ENV !== 'production') {
	middleware.push(log);
}

export default applyMiddleware(...middleware);
