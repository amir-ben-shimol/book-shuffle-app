/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-commonjs */
const colors = require('./src/styles/colors.cjs');

module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}', './src/app/**/*.{js,ts,jsx,tsx}', './src/lib/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				purplePrimary: `rgb(${colors.purplePrimary} / <alpha-value>)`,
				pinkPrimary: `rgb(${colors.pinkPrimary} / <alpha-value>)`,
				pinkLight: `rgb(${colors.pinkLight} / <alpha-value>)`,
				pinkBorder: `rgb(${colors.pinkBorder} / <alpha-value>)`,
				bluePrimary: `rgb(${colors.bluePrimary} / <alpha-value>)`,
				blueSecondery: `rgb(${colors.blueSecondery} / <alpha-value>)`,
				blueAccent: `rgb(${colors.blueAccent} / <alpha-value>)`,
				greenPrimary: `rgb(${colors.greenPrimary} / <alpha-value>)`,
				purpleText: `rgb(${colors.purpleText} / <alpha-value>)`,
				blueText: `rgb(${colors.blueText} / <alpha-value>)`,
				blueDarkText: `rgb(${colors.blueDarkText} / <alpha-value>)`,
				grayPrimary: `rgb(${colors.grayPrimary} / <alpha-value>)`,
				offWhite: `rgb(${colors.offWhite} / <alpha-value>)`,
				white: `rgb(${colors.white} / <alpha-value>)`,
				black: `rgb(${colors.black} / <alpha-value>)`,
				error: `rgb(${colors.error} / <alpha-value>)`,
				success: `rgb(${colors.success} / <alpha-value>)`,
			},
		},
	},
	plugins: [],
};
