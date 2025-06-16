import type { t_activity } from "./activity";

export type t_session = {
  name: string; 
  description: string; 
  sessionInstanceId: string; 
  sessionTemplateId: string;
  scheduledDate: string;
  status: string;
  activities: t_activity[]
}