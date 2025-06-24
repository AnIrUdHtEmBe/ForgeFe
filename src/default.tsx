import { MdFitnessCenter } from 'react-icons/md';
import { IoIosFootball } from 'react-icons/io';
import { MdSportsTennis } from 'react-icons/md';
import { GiShuttlecock } from 'react-icons/gi';
import { VscWorkspaceUnknown } from 'react-icons/vsc';
import { IoIosInfinite } from 'react-icons/io';
import { TbYoga } from 'react-icons/tb';
import { TbPhysotherapist } from 'react-icons/tb';

export const DEFAULT_ICON_SIZE = 30;

export const categories = [
	{
		name: 'Fitness',
		icon: () => <MdFitnessCenter size={DEFAULT_ICON_SIZE} />,
	},
	{
		name: 'Wellness',
		icon: () => <MdFitnessCenter size={DEFAULT_ICON_SIZE} />,
	},

	{
		name: 'Nutrition',
		icon: () => <MdFitnessCenter size={DEFAULT_ICON_SIZE} />,
	},
	{
		name: 'Progress tracking',
		icon: () => <MdFitnessCenter size={DEFAULT_ICON_SIZE} />,
	},
];

export const SNACK_AUTO_HIDE = 3000;

export const SPORTS = [
	{
		name: 'football',
		icon: <IoIosFootball size={DEFAULT_ICON_SIZE} />,
	},
	{
		name: 'Tennis',
		icon: <MdSportsTennis size={DEFAULT_ICON_SIZE} />,
	},
	{
		name: 'Badminton',
		icon: <GiShuttlecock size={DEFAULT_ICON_SIZE} />,
	},
	{
		name: 'All',
		icon: <IoIosInfinite size={DEFAULT_ICON_SIZE} />,
	},
];

export const UNKNOWN_SPORTS_ICON = (
	<VscWorkspaceUnknown size={DEFAULT_ICON_SIZE} />
);

export const wellnessWindows = {
	Wellness: [
		{
			name: 'Yoga',
			icon: <TbYoga />,
		},
		{
			name: 'Physio',
			icon: <TbPhysotherapist />,
		},
		{
			name: 'Physio',
			icon: <TbPhysotherapist />,
		},
		{
			name: 'Physio',
			icon: <TbPhysotherapist />,
		},
	],
};

export const detailsInfoWellness = {
	Yoga: {
		title: 'Group Session',
		fullName: "Yoga", 
		description: 'deawjljqlajdlwldnnwandl',
		path: 'yoga.jpeg',
		fields: {
			ageGroup: '30-40 years',
			sessionTimings: 'Saturday - 07:00am ',
			coach: 'Arerav',
			moreInfo: 'wdalkjdnl',
		},
	},
	Physio: {
		path: 'yoga.jpeg',
		fullName: 'Physiotherapy', 
		title: '1-on-1 Session',
		description: 'edwawdwd',
		fields: {
			operatingHours: 'awjkld',
			doctor: 'dw',
			moreInfo: 'wd',
			selectATime: 'time',
		},
	},
	BodyBuilding: {
		path: 'yoga.jpeg',
		fullName: 'Body Building', 
		title: '1-on-1 Session',
		description: 'edwawdwd',
		fields: {
			operatingHours: 'awjkld',
			doctor: 'dw',
			moreInfo: 'wd',
			selectATime: 'time',
		},
	},
	Strength: {
		path: 'yoga.jpeg',
		fullName: 'Strength Training', 
		title: '1-on-1 Session',
		description: 'edwawdwd',
		fields: {
			operatingHours: 'awjkld',
			doctor: 'dw',
			moreInfo: 'wd',
			selectATime: 'time',
		},
	},
};
