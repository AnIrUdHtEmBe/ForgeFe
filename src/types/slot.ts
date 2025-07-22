export type t_slot = {
 slotId: string;
 courtId: string;
 startTime: string;      // ISO datetime string
 endTime: string;        // ISO datetime string
 status: string;         // e.g., "available"
 bookingInfo: null // Use specific type if known
 slotSize: number;       // in minutes
 date: string;           // ISO date string
 st_unix: number;        // Unix timestamp (seconds)
 et_unix: number;        // Unix timestamp (seconds)
 price?:number;
};
