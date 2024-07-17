import React, { type ReactNode, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';

import type { icons } from '@/assets/icons';
import { UISvg } from './UISvg';
import { UIButton } from './UIButton';

export type TabProps = {
	readonly name: string | ReactNode;
	readonly content?: React.ReactNode;
	readonly icon?: keyof typeof icons;
	readonly iconClassName?: string;
	readonly label?: string;
	readonly onClick?: VoidFunction;
};

type Props = {
	readonly tabs: TabProps[];
	readonly variant: 'white' | 'gradientRedPurple' | 'gradientGreenBlue' | 'dark' | 'blue';
	readonly tabsWidth?: 'small' | 'medium' | 'large';
	readonly className?: string;
	readonly labels?: string[];
	readonly bottomLabels?: string[];
	readonly bottomLabelClick?: VoidFunction;
	readonly getActiveTab?: (activeTab: number) => void;
};

export const UITabs: React.FC<Props> = ({ tabs, variant, className, tabsWidth, labels, bottomLabels, bottomLabelClick, getActiveTab }) => {
	const [activeTab, setActiveTab] = useState(0);

	useEffect(() => {
		if (getActiveTab) getActiveTab(activeTab);
	}, [activeTab]);

	return (
		<View className={`tabs-container ${className}`}>
			{labels && labels[activeTab]?.length ? (
				<View className="mb-6 flex items-center">
					<Text className="text-base font-medium text-grayPrimary">{labels[activeTab]}</Text>
				</View>
			) : (
				<View
					className={`mb-6 flex flex-row justify-between border-b border-bluePrimary ${
						tabsWidth === 'small' ? 'w-1/2' : tabsWidth === 'medium' ? 'w-3/4' : tabsWidth === 'large' ? 'w-4/5' : 'w-full'
					}`}
				>
					{tabs.map((tab, index) => (
						<View
							className={`flex-grow ${activeTab === index ? `border-${variant} border-b-2 border-bluePrimary` : 'border-transparent'}`}
							key={index}
						>
							<TouchableOpacity
								className={`flex w-full items-center px-4 py-2 text-center text-sm font-medium ${
									activeTab === index ? `text-${variant}` : 'text-gray-500'
								}`}
								onPress={() => {
									setActiveTab(index);
									Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);

									tab.onClick && tab.onClick();
								}}
							>
								{tab.icon && <UISvg name={tab.icon} className={`mb-4 h-6 w-6 fill-bluePrimary ${tab.iconClassName}`} />}
								<Text className="text-bluePrimary">{tab.name}</Text>
							</TouchableOpacity>
						</View>
					))}
				</View>
			)}

			<View className="tab-content">{tabs[activeTab]?.content}</View>
			{bottomLabels && bottomLabels?.[activeTab] && bottomLabels?.[activeTab]?.length && (
				<UIButton
					label={bottomLabels[activeTab]}
					varient="buttonTextRed"
					icon="arrow"
					buttonSize="large"
					className="mb-4 flex items-center"
					onClick={() => {
						setActiveTab(0);
						bottomLabelClick?.();
					}}
				/>
			)}
		</View>
	);
};
