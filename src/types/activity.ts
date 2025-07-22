export type t_activity = {
  completed: boolean;
  customReps: string;
  icon: string;
  name: string;
  activityId: string;
  status?:string
  description?:string;
  target?:number;
  unit?:string
}