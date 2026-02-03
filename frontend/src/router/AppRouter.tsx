import { Routes, Route } from "react-router-dom";
import Home from "@pages/Overview/Home";
import CompleteRegistration from "@pages/CompleteRegistration";
import ConfirmAccount from "@pages/ConfirmAccount";
import Login from "@pages/Login";
import AuthGate from "@components/auth/AuthGate";
import MainLayout from "@layout/MainLayout";
import Users from "@pages/Admin/Users"; 
import ReportTypes from "@pages/Admin/ReportTypes";
import ActivityContainer from "@pages/Overview/Activity";
import Providers from "@pages/Setup/Providers";
import EntityTypes from "@pages/Setup/EntityTypes";

export const protectedRoutes = [
  { path: "/", element: <Home /> },
  { path: "/activity", element: <ActivityContainer /> },
  { path: "/admin/users", element: <Users /> },
  { path: "/admin/report-types", element: <ReportTypes /> },
  { path: "/setup/providers", element: <Providers /> },
  { path: "/setup/entity-types", element: <EntityTypes /> },
]

const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/complete-registration" element={<CompleteRegistration />} />
      <Route path="/confirm-account" element={<ConfirmAccount />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      {protectedRoutes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={
            <AuthGate>
              <MainLayout>{element}</MainLayout>
            </AuthGate>
          }
        />
      ))}
    </Routes>
  );
};

export default AppRouter;
