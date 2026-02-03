import { ProjectInfoResponse } from "./projects";
import { ProjectRole } from "./enums";

export type InvitationResponse = {
    email: string;
    project: ProjectInfoResponse;
    role: ProjectRole;
    expires_at: string;
    accepted_at: string | null;
}