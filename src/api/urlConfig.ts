export const PATH = 'http://3.111.32.88:8080';
export const PATH_V2 = 'http://3.111.32.88:6060'

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

export const ADD_PLAYES_TO_GAME = (bookingId: string , userId : string) =>
	`/booking/add-players/${bookingId}?userIds=${userId}`;


export const GET_HUMAN_BY_ID = (id: string) =>
	`/human/${id}`;


