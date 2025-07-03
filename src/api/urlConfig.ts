import type { RegisterFormData } from "../components/Register/Register";

export const PATH = 'https://forge-play-backend.forgehub.in';
export const PATH_V2 = 'https://play-os-backend.forgehub.in'

export const GET_USER_PLAN = (id: string) =>
	`/humans/${id}/plan-instances-within-date`;

export const GET_ALL_COURTS = (arenaId: string) =>
	`/arena/${arenaId}/courts`;

export const GET_TIME_SLOTS = (courtId: string) => 
	`/court/${courtId}/slots`;

export const GET_ALL_SPORTS = (category: string) => 
	`/sports/category/${category}`;

export const GET_ALL_GAMES = (sportId: string, date: string, courtId: string) =>
  `/game/games/by-sport?sportId=${sportId}&date=${date}&courtId=${courtId}`;

export const ADD_PLAYES_TO_GAME = (gameId: string , userId : string , target : string) =>
	`/game/add-players/${gameId}?playerIds=${userId}&targetList=${target}`;


export const GET_HUMAN_BY_ID = (id: string) =>
	`/human/${id}`;


export const REGISTER_HUMANS = () => 
	`/human/register`;


export const LOGIN_HUMANS = () => 
	`/auth/login`;

export const GET_IMAGE_BY_ID = () =>
	`/human/human/get-photo`;

export const GET_ALL_IMAGES = () =>
	`/human/human/get-photo-bulk`;

export const UPLOAD_IMAGE = () =>
	`/human/human/upload-photo`;

// trying to commit again