import registerMessageHandlers from './registerMessageHandlers';
import registerRoutes from './registerRoutes';
import setupWorkbox from './setupWorkbox';
import { handleMessageFromClient } from './Utilities/messageHandler';

setupWorkbox();

registerRoutes();

registerMessageHandlers();

self.addEventListener('message', (e) => {
    const { type, payload } = e.data;

    handleMessageFromClient(type, payload, e);
});
