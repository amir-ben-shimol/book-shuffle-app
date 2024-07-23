import * as Haptics from 'expo-haptics';

const hapticTimings = [800, 600, 500, 400, 300, 300, 300, 200, 200, 200, 200];

export const onLongHaptics = (onComplete: () => void) => {
	let index = 0;

	const hapticFeedback = () => {
		if (index >= hapticTimings.length) {
			onComplete();

			return;
		}

		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);

		setTimeout(() => {
			index++;
			hapticFeedback();
		}, hapticTimings[index]);
	};

	hapticFeedback();
};
