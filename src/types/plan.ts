import type { t_session } from "./session";

export type t_plan = {
	startDate: string;
	userId: string;
	guideId: string;
	endDate: string;
	planTemplateId: string;
	title: string;
	description: string;
	sessionInstances	: t_session[];
	status: string;
  sessionIds: string[]
};
