import { Routes, Route } from "react-router-dom";
import Home from "@pages/Overview/Home";
import CompleteRegistration from "@pages/CompleteRegistration";
import ConfirmAccount from "@pages/ConfirmAccount";
import Login from "@pages/Login";
import AuthGate from "@components/auth/AuthGate";
import MainLayout from "@layout/MainLayout";
import Users from "@pages/Admin/Users";
import ReportTypes from "@pages/Admin/ReportTypes";
import WorkspaceSettings from "@pages/Admin/WorkspaceSettings";
import ActivityContainer from "@pages/Overview/Activity";
import Providers from "@pages/Setup/Providers";
import EntityTypes from "@pages/Setup/EntityTypes";
import PlaceholderPage from "@pages/PlaceholderPage";
import NewSubmissionWizard from "@pages/Submissions/NewSubmissionWizard";
import FieldMappingWizard from "@pages/FieldMapping";

const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/complete-registration" element={<CompleteRegistration />} />
      <Route path="/confirm-account" element={<ConfirmAccount />} />
      <Route path="/login" element={<Login />} />

      {/* Protected app shell (keeps Topbar/Sidebar mounted) */}
      <Route
        element={
          <AuthGate>
            <MainLayout />
          </AuthGate>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/workspace" element={<PlaceholderPage title="Workspace" />} />
        <Route path="/activity" element={<ActivityContainer />} />
        <Route path="/field-mapping" element={<FieldMappingWizard />} />
        <Route path="/submissions" element={<PlaceholderPage title="Submissions" />} />
        <Route path="/submissions/new" element={<NewSubmissionWizard />} />

        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/report-types" element={<ReportTypes />} />
        <Route path="/admin/workspace-settings" element={<WorkspaceSettings />} />
        <Route path="/admin/groups" element={<PlaceholderPage title="User Groups" />} />
        <Route path="/admin/permissions" element={<PlaceholderPage title="Permissions" />} />
        <Route path="/admin/subscription" element={<PlaceholderPage title="Subscription" />} />
        <Route path="/admin/integrations" element={<PlaceholderPage title="Integrations" />} />

        <Route path="/setup/providers" element={<Providers />} />
        <Route path="/setup/data-packets" element={<PlaceholderPage title="Data Packets" />} />
        <Route path="/setup/report-types" element={<ReportTypes />} />
        <Route path="/setup/entity-types" element={<EntityTypes />} />
        <Route path="/setup/entities" element={<PlaceholderPage title="Entities" />} />
        <Route path="/setup/schedules" element={<PlaceholderPage title="Schedules" />} />
        <Route
          path="/setup/value-mapping-sets"
          element={<PlaceholderPage title="Value Mapping Sets" />}
        />
        <Route path="/setup/validation-rules" element={<PlaceholderPage title="Validation Rules" />} />

        <Route path="*" element={<PlaceholderPage title="Not Found" />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
