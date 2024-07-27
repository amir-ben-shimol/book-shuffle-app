import React from 'react';
import HTMLView from 'react-native-htmlview';
import { StyleSheet } from 'react-native';

type Props = {
	readonly value: string;
};

export const UIHtmlView = (props: Props) => {
	return <HTMLView value={props.value} stylesheet={styles} />;
};

const styles = StyleSheet.create({
	a: {
		fontWeight: '300',
		color: '#3b82f6',
	},
	br: {
		height: 10,
	},
});
