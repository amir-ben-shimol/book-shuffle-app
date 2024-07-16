import Ionicons from '@expo/vector-icons/Ionicons';
import { type PropsWithChildren, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const UICollapsible = ({ children, title }: PropsWithChildren & { title: string }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<View>
			<TouchableOpacity style={styles.heading} activeOpacity={0.8} onPress={() => setIsOpen((value) => !value)}>
				<Ionicons
					name={isOpen ? 'chevron-down' : 'chevron-forward-outline'}
					size={18}
					// color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
				/>
				<Text>{title}</Text>
			</TouchableOpacity>
			{isOpen && <View style={styles.content}>{children}</View>}
		</View>
	);
};

const styles = StyleSheet.create({
	heading: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	content: {
		marginTop: 6,
		marginLeft: 24,
	},
});
