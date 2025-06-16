export const PATH = 'http://3.111.32.88:8080';

export const GET_USER_PLAN = (id: string) =>
	`/humans/${id}/plan-instances-within-date`;

export const PATH_V2 = 'http://3.111.32.88:6060'



export const GET_ALL_COURTS = (arenaId: string) =>
	`/arena/${arenaId}/courts`;

export const GET_TIME_SLOTS = (courtId: string) => 
	`/court/${courtId}/slots`;