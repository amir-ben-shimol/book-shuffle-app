const inflintConfig = {
	aliases: {
		'[UIComponent]': 'UI([A-Z][a-z0-9]+)((d)|([A-Z0-9][a-z0-9]+))*([A-Z])?',
		// '[AppRouter]': `/[\(\[]([a-z]+(?:-[a-z]+)*)[\)\]]/g`,
	},
	rules: {
		'src/lib/{data,types,utils,helpers}/**/*': [2, 'kebab-case'],
		'src/lib/{hooks,providers}/**/*': [2, 'camelCase'],
		'src/components/{layouts,modules}/*': [2, 'PascalCase.Point'],
		'src/components/ui/*': [2, '[UIComponent]'],
	},
};

module.exports = inflintConfig;
