import { ProjectStatus } from "./enums";

export type ProjectInfoResponse = {
    id: number;
    name: string;
    slug: string;
    status: ProjectStatus;
}

export type ProjectResolveRequest = {
    name: string;
}
