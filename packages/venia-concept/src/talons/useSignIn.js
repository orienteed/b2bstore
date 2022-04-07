import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

export default (original) => {

    return function useSignIn(props, ...restArgs) {

      const history = useHistory();
  
      // Run the original, wrapped function
      let { ...defaultReturnData } = original(
        props,
        ...restArgs
      );

      const handleCreateAccount = useCallback(() => {
        history.push('/create-account');
      }, []);

      const handleCreateAccountNonCustomer = useCallback(() => {
        history.push('/create-account-non-customer');
      }, []);

      const handleCreateAccountBeCustomer = useCallback(() => {
        history.push('/create-account-be-customer');
      }, []);

      const handleForgotPassword = useCallback(() => {
        history.push('/forgot-password');
      }, []);
  
      // Add the new data to the data returned by the original function
      return {
        ...defaultReturnData,
        handleCreateAccount,
        handleCreateAccountNonCustomer,
        handleCreateAccountBeCustomer,
        handleForgotPassword
      };
    };
  };