import { MdFitnessCenter } from 'react-icons/md';
import { IoIosFitness, IoIosFootball } from 'react-icons/io';
import { MdSportsTennis } from 'react-icons/md';
import { GiShuttlecock } from 'react-icons/gi';
import { VscWorkspaceUnknown } from 'react-icons/vsc';
import { IoIosInfinite } from 'react-icons/io';
import {  TbWeight, TbYoga } from 'react-icons/tb';
import { TbPhysotherapist } from 'react-icons/tb';
import {
  MdSelfImprovement,
  MdFastfood,
  MdTimeline,
  MdSportsSoccer,
  MdCategory,
  MdApps,
} from "react-icons/md";
export const DEFAULT_ICON_SIZE = 30;

// export const categories = [
// 	{
// 		name: 'Fitness',
// 		icon: () => <MdFitnessCenter size={DEFAULT_ICON_SIZE} />,
// 	},
// 	{
// 		name: 'Wellness',
// 		icon: () => <MdFitnessCenter size={DEFAULT_ICON_SIZE} />,
// 	},

// 	{
// 		name: 'Nutrition',
// 		icon: () => <MdFitnessCenter size={DEFAULT_ICON_SIZE} />,
// 	},
// 	{
// 		name: 'Progress tracking',
// 		icon: () => <MdFitnessCenter size={DEFAULT_ICON_SIZE} />,
// 	},
// ];
export const categories = [
  {
    name: "All",
    icon: () => <MdApps size={DEFAULT_ICON_SIZE} />,
  },
  {
    name: "Fitness",
    icon: () => <MdFitnessCenter size={DEFAULT_ICON_SIZE} />,
  },
  {
    name: "Wellness",
    icon: () => <MdSelfImprovement size={DEFAULT_ICON_SIZE} />,
  },
  {
    name: "Nutrition",
    icon: () => <MdFastfood size={DEFAULT_ICON_SIZE} />,
  },
//   {
//     name: "Progress tracking",
//     icon: () => <MdTimeline size={DEFAULT_ICON_SIZE} />,
//   },
  {
    name: "Sports",
    icon: () => <MdSportsSoccer size={DEFAULT_ICON_SIZE} />,
  },
  {
    name: "Other",
    icon: () => <MdCategory size={DEFAULT_ICON_SIZE} />,
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

export const wellnessWindows =  [
		{
			name: 'yoga',
			icon: <TbYoga />,
		},
		{
			name: 'Physio',
			icon: <TbPhysotherapist />,
		},
		{
			name: 'strength',
			icon: <TbWeight/>
		},
		{
			name: 'bodybuilding',
			icon: <IoIosFitness />,
		},
	];

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
		path: 'bodybuilding.png',
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
		path: 'fitness.png',
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
