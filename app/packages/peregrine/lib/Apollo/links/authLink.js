import { setContext } from '@apollo/client/link/context';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

const storage = new BrowserPersistence();

export default function createAuthLink() {
    return setContext((_, { headers }) => {
        // get the authentication token from local storage if it exists.
        const token = storage.getItem('signin_token');

        // return the headers to the context so httpLink can read them
        // backendTechnology: 'magento', // TODO_B2B: update this to be dynamic from S3 data
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : ''
            }
        };
    });
}
