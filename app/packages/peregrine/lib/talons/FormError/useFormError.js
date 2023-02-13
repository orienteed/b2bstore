import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { deriveErrorMessage } from '../../util/deriveErrorMessage';

export const useFormError = props => {
	const { errors, allowErrorMessages } = props;
	const { formatMessage } = useIntl();

	const derivedErrorMessage = useMemo(() => {
		const defaultErrorMessage = allowErrorMessages
			? ''
			: formatMessage({
				id: 'formError.errorMessage',
				defaultMessage: 'An error has occurred. Please check the input and try again.'
			  });
		return deriveErrorMessage(errors, defaultErrorMessage);
	}, [errors, formatMessage, allowErrorMessages]);

	return {
		errorMessage: derivedErrorMessage
	};
};
