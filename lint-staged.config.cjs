module.exports = {
	'**/*.{ts,tsx,cjs}': 'eslint -c ./.eslintrc.cjs --fix',

	'**/*.{ts,js,cjs,json,yaml}': 'prettier --write',
};
