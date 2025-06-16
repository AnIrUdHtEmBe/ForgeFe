export type t_court = {
  courtId: string;
  arenaId: string;
  name : string;
  capacity: number;
  allowedSports: string[];
  openingTime: string;
  closingTime: string;
  status: string;
  slotSize: number;
}