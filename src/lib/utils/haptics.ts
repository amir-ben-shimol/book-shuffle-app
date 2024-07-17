import * as Haptics from 'expo-haptics';

export const onLongHaptics = () => {
	const startTime = Date.now();
	const duration = 5000; // Total duration in milliseconds
	const startInterval = 150; // Start interval in milliseconds
	const endInterval = 50; // End interval in milliseconds

	const hapticFeedback = () => {
		const elapsedTime = Date.now() - startTime;

		if (elapsedTime >= duration) {
			clearInterval(intervalShort);

			return;
		}

		// Calculate the current interval based on elapsed time
		const currentInterval = startInterval + (endInterval - startInterval) * (elapsedTime / duration);

		// Provide haptic feedback
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);

		// Schedule next haptic feedback
		clearInterval(intervalShort);
		intervalShort = setInterval(hapticFeedback, currentInterval);
	};

	let intervalShort = setInterval(hapticFeedback, startInterval);

	// Clear interval after the total duration
	setTimeout(() => {
		clearInterval(intervalShort);
	}, duration);

	return () => clearInterval(intervalShort);
};
