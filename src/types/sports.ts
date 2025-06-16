export type t_sport = {
  name: string;
  description: string;
  maxPlayers: number;
  minPlayers: number;
  minTime: number;
  maxTime: number;
  icon?: string;
  instucuctions: string[];
  ctegory: string;
  sportId: string;
}