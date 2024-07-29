/* eslint-disable import/no-commonjs */
module.exports = function (api) {
	api.cache(true);

	return {
		presets: ['babel-preset-expo', '@babel/preset-typescript'],
		plugins: ['nativewind/babel', 'react-native-reanimated/plugin'],
	};
};
