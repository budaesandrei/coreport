from enum import Enum


class ProjectStatus(str, Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"
    ARCHIVED = "archived"
    DELETED = "deleted"


class UserStatus(str, Enum):
    ACTIVE = "active"
    INVITED = "invited"
    SUSPENDED = "suspended"
    DEACTIVATED = "deactivated"


class GlobalUserRole(str, Enum):
    USER = "user"
    SUPER_ADMIN = "super_admin"
    SUPPORT = "support"


class ProjectRole(str, Enum):
    PROJECT_ADMIN = "project_admin"
    REPORT_SUBMITTER = "report_submitter"
    REPORT_APPROVER = "report_approver"
    VIEWER = "viewer"


class WorkspaceRole(str, Enum):
    # Minimum required roles for task-12.
    admin = "admin"
    submitter = "submitter"
    approver = "approver"
    viewer = "viewer"


class ExpiryPreset(str, Enum):
    ONE_HOUR = "1h"
    SIX_HOURS = "6h"
    TWENTY_FOUR_HOURS = "24h"
    TWO_DAYS = "48h"
    SEVEN_DAYS = "7d"


class InvitationType(str, Enum):
    INVITE = "invite"
    PROJECT_REGISTRATION = "project_registration"


class EntityAttributeType(str, Enum):
    TEXT = "text"
    NUMBER = "number"
    DATE = "date"
    BOOLEAN = "boolean"
