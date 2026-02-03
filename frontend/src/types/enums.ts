export enum ProjectStatus {
  ACTIVE = "active",
  SUSPENDED = "suspended",
  ARCHIVED = "archived",
  DELETED = "deleted",
}

export enum ProjectRole {
  PROJECT_ADMIN = "project_admin",
  REPORT_SUBMITTER = "report_submitter",
  REPORT_APPROVER = "report_approver",
  VIEWER = "viewer",
}

export enum UserStatus {
  ACTIVE = "active",
  INVITED = "invited",
  SUSPENDED = "suspended",
  DEACTIVATED = "deactivated",
}

export enum EntityAttributeType {
  TEXT = "text",
  NUMBER = "number",
  DATE = "date",
  BOOLEAN = "boolean"
}