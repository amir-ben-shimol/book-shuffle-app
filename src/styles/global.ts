import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
	shadowBox: {
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	whiteAndShadow: {
		shadowColor: 'rgba(154, 63, 130, 1)',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 10,
		elevation: 10,
		backgroundColor: 'white',
	},
	shadowCard: {
		shadowColor: 'rgba(149, 173, 201, 1)',
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.25,
		shadowRadius: 20,
		elevation: 5,
	},
	shadowNavElement: {
		shadowColor: 'rgba(149, 173, 201, 1)',
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.25,
		shadowRadius: 20,
		elevation: 5,
	},
	shadowButton: {
		shadowColor: 'rgba(154, 63, 130, 1)',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 10,
		elevation: 5,
	},
	text: {
		fontFamily: 'Rubik',
	},
});

export default globalStyles;
