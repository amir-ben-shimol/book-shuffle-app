import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, type ImageSourcePropType, type ViewStyle } from 'react-native';

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		left: 0,
		right: 0,
		alignItems: 'center',
	},
	pulse: {
		position: 'absolute',
		flex: 1,
	},
});

type UIPulseProps = {
	color?: string;
	diameter?: number;
	duration?: number;
	image?: { source: ImageSourcePropType; style: ViewStyle };
	initialDiameter?: number;
	numPulses?: number;
	pulseStyle?: ViewStyle;
	speed?: number;
	style?: ViewStyle;
};

type Pulse = {
	pulseKey: number;
	diameter: number;
	opacity: number;
	centerOffset: number;
};

export const UIPulse: React.FC<UIPulseProps> = ({
	color = 'blue',
	diameter = 400,
	duration = 1000,
	initialDiameter = 0,
	numPulses = 3,
	pulseStyle = {},
	speed = 10,
	style = {
		top: 0,
		bottom: 0,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
}) => {
	const [pulses, setPulses] = useState<Pulse[]>([]);
	const [started, setStarted] = useState(false);
	const mounted = useRef(true);

	useEffect(() => {
		setStarted(true);
		createPulse();

		let a = 1;

		while (a < numPulses) {
			setTimeout(() => {
				createPulse();
			}, a * duration);

			a++;
		}

		const timer = setInterval(() => {
			updatePulse();
		}, speed);

		return () => {
			mounted.current = false;
			clearInterval(timer);
		};
	}, []);

	const createPulse = () => {
		if (mounted.current) {
			setPulses((prevPulses) => [
				...prevPulses,
				{
					pulseKey: prevPulses.length + 1,
					diameter: initialDiameter,
					opacity: 0.5,
					centerOffset: (diameter - initialDiameter) / 2,
				},
			]);
		}
	};

	const updatePulse = () => {
		if (mounted.current) {
			setPulses((prevPulses) =>
				prevPulses.map((p, i) => {
					const newDiameter = p.diameter > diameter ? 0 : p.diameter + 2;
					const centerOffset = (diameter - newDiameter) / 2;
					const opacity = Math.abs(newDiameter / diameter - 1);

					return {
						pulseKey: i + 1,
						diameter: newDiameter,
						opacity: opacity > 0.5 ? 0.5 : opacity,
						centerOffset: centerOffset,
					};
				}),
			);
		}
	};

	const containerStyle = [styles.container, style];
	const pulseWrapperStyle = { width: diameter, height: diameter };

	return (
		<View style={containerStyle}>
			{started && (
				<View style={pulseWrapperStyle}>
					{pulses.map((pulse) => (
						<View
							key={pulse.pulseKey}
							testID="pulse"
							style={[
								styles.pulse,
								{
									backgroundColor: color,
									width: pulse.diameter,
									height: pulse.diameter,
									opacity: pulse.opacity,
									borderRadius: pulse.diameter / 2,
									top: pulse.centerOffset,
									left: pulse.centerOffset,
								},
								pulseStyle,
							]}
						/>
					))}
				</View>
			)}
		</View>
	);
};
