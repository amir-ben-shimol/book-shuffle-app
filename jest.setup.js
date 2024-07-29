import '@testing-library/jest-native/extend-expect';

global.navigator = {
	clipboard: {
		writeText: jest.fn(),
		readText: jest.fn(),
	},
};

jest.mock('react-native-vector-icons/MaterialIcons', () => {
	const React = require('react');

	return {
		__esModule: true,
		default: (props) => {
			return React.createElement('View', {
				...props,
				testID: props.testID || 'mock-icon',
			});
		},
	};
});
