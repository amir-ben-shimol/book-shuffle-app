/* do not change this file, it is auto generated by storybook. */

import { start, prepareStories, getProjectAnnotations } from '@storybook/react-native';

import '@storybook/addon-ondevice-controls/register';
import '@storybook/addon-ondevice-actions/register';

const normalizedStories = [
	{
		titlePrefix: '',
		directory: './src/stories',
		files: '**/*.stories.?(ts|tsx|js|jsx)',
		importPathMatcher: /^\.(?:(?:^|\/|(?:(?:(?!(?:^|\/)\.).)*?)\/)(?!\.)(?=.)[^/]*?\.stories\.(?:ts|tsx|js|jsx)?)$/,
		// @ts-ignore
		req: require.context('../src/stories', true, /^\.(?:(?:^|\/|(?:(?:(?!(?:^|\/)\.).)*?)\/)(?!\.)(?=.)[^/]*?\.stories\.(?:ts|tsx|js|jsx)?)$/),
	},
];

declare global {
	var view: ReturnType<typeof start>;
	var STORIES: typeof normalizedStories;
}

const annotations = [require('./preview'), require('@storybook/react-native/dist/preview'), require('@storybook/addon-actions/preview')];

global.STORIES = normalizedStories;

// @ts-ignore
module?.hot?.accept?.();

if (!global.view) {
	global.view = start({
		annotations,
		storyEntries: normalizedStories,
	});
} else {
	const { importMap } = prepareStories({ storyEntries: normalizedStories });

	global.view._preview.onStoriesChanged({
		importFn: async (importPath: string) => importMap[importPath],
	});

	global.view._preview.onGetProjectAnnotationsChanged({
		getProjectAnnotations: getProjectAnnotations(global.view, annotations),
	});
}

export const view = global.view;
