import { UserStatus, ProjectRole } from "./enums";

export type ProjectUserResponse = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  provider_name: string | null;
  status: UserStatus;
  role: ProjectRole;
  created_at: Date;
  created_by: string;
  updated_at: Date;
  updated_by: string;
};

export type ProjectUserCreateRequest = {
  email: string;
  first_name: string;
  last_name: string;
  role: ProjectRole;
};

export type ProjectUserUpdateRequest = {
  first_name?: string;
  last_name?: string;
  role: ProjectRole;
  provider_name?: string;
  status: UserStatus;
};
