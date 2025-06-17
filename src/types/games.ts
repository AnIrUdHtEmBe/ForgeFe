export type t_game = {
  hostId: string;
  sport: string;
  courtId: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  bookedBy: string;
  difficultyLevel: string;
  maxPlayers: number;
  priceType: string | null;
  rackPrice: number;
  quotePrice: number;
  gameId: string;
  bookingId: string;
  scheduledPlayers: string[];
  actualPlayers: string[];
  status: string;
  chatId: string;
  bookingDetails: {
    courtId: string;
    bookedBy: string;
    sportId: string;
    startTime: string; // ISO string
    endTime: string;   // ISO string
    status:string;
    joinedUsers: string[];
    price: number | null;
    capacity: number | null;
    st_unix: number;
    et_unix: number;
    bookingId: string;
  };
}