export type MenuItem = {
  label: string;
  path: string;
  icon?: string;
};

export type MenuSection = {
  label: string;
  role?: string;
  children: MenuItem[];
};

export const menuItems: MenuSection[] = [
  {
    label: "Overview",
    children: [
      {
        label: "Home",
        path: "/",
        icon: "home"
      },
      {
        label: "Workspace",
        path: "/workspace",
        icon: "workspaces"
      },
      {
        label: "Activity",
        path: "/activity",
        icon: "timeline"
      },
      {
        label: "Field Mapping",
        path: "/field-mapping",
        icon: "data_object"
      },
      {
        label: "Submissions",
        path: "/submissions",
        icon: "table_view"
      }
    ]
  },
  {
    label: "Setup",
    role: "PROJECT_ADMIN",
    children: [
      {
        label: "Providers",
        path: "/setup/providers",
        icon: "work_outline"
      },
      {
        label: "Data Packets",
        path: "/setup/data-packets",
        icon: "source"
      },
      {
        label: "Report Types",
        path: "/setup/report-types",
        icon: "stacked_bar_chart"
      },
      {
        label: "Entity Types",
        path: "/setup/entity-types",
        icon: "panorama_fish_eye"
      },
      {
        label: "Entities",
        path: "/setup/entities",
        icon: "blur_circular"
      },
      {
        label: "Schedules",
        path: "/setup/schedules",
        icon: "schedule"
      },
      {
        label: "Value Mapping Sets",
        path: "/setup/value-mapping-sets",
        icon: "alt_route"
      },
      {
        label: "Validation Rules",
        path: "/setup/validation-rules",
        icon: "rule"
      }
    ]
  },
  {
    label: "Admin",
    role: "PROJECT_ADMIN",
    children: [
      {
        label: "Users & Roles",
        path: "/admin/users",
        icon: "person"
      },
      {
        label: "User Groups",
        path: "/admin/groups",
        icon: "people"
      },
      {
        label: "Permissions",
        path: "/admin/permissions",
        icon: "verified_user"
      },
      {
        label: "Subscription",
        path: "/admin/subscription",
        icon: "credit_card"
      },
      {
        label: "Workspace Settings",
        path: "/admin/workspace-settings",
        icon: "settings"
      },
      {
        label: "Integrations",
        path: "/admin/integrations",
        icon: "electrical_services"
      }
    ]
  }
];
