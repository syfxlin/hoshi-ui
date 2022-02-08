import React from "react";
import { Navigate, Route } from "react-router-dom";
import Index from "./modules/Index";
import { AnonymousRoute } from "./router/AnonymousRoute";
import { lazy } from "@loadable/component";
import { AuthorizeRoute } from "./router/AuthorizeRoute";
import Routes from "./router/Routes";
import BrowserRouter from "./router/BrowserHistory";
import { history } from "./router/history";
import LoadingBox from "./components/LoadingBox";

// App
const Login = lazy(() => import("./modules/auth/Login"));
const Register = lazy(() => import("./modules/auth/Register"));
const ResetPassword = lazy(() => import("./modules/auth/ResetPassword"));
const UserInfo = lazy(() => import("./modules/user/UserInfo"));
const Dashboard = lazy(() => import("./modules/dashboard/Dashboard"));
const Admin = lazy(() => import("./modules/admin/Admin"));
const Settings = lazy(() => import("./modules/settings/Settings"));
const Share = lazy(() => import("./modules/share/Share"));
const NotFound = lazy(() => import("./modules/NotFound"));

// Dashboard
const Home = lazy(() => import("./modules/dashboard/panels/Home"));
const File = lazy(() => import("./modules/dashboard/panels/File"));
const Doc = lazy(() => import("./modules/dashboard/panels/Doc"));
const Trash = lazy(() => import("./modules/dashboard/panels/Trash"));
const Archive = lazy(() => import("./modules/dashboard/panels/Archive"));
const Shares = lazy(() => import("./modules/dashboard/panels/Shares"));
const Workspace = lazy(() => import("./modules/dashboard/panels/Workspace"));

// Settings
const Info = lazy(() => import("./modules/settings/panels/Info"));
const Safety = lazy(() => import("./modules/settings/panels/Safety"));
const Tokens = lazy(() => import("./modules/settings/panels/Tokens"));

// Admin
const AdminUsers = lazy(() => import("./modules/admin/panels/Users"));
const AdminRoles = lazy(() => import("./modules/admin/panels/Roles"));

const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter history={history}>
        <React.Suspense fallback={<LoadingBox />}>
          <Routes>
            {/* Index */}
            <Route index element={<Index />} />
            {/* Auth */}
            <AnonymousRoute path="/login" element={<Login />} />
            <AnonymousRoute path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/users/:username" element={<UserInfo />} />
            {/* Dashboard */}
            <AuthorizeRoute path="/dashboard" element={<Dashboard />}>
              <Route index element={<Navigate to="home" />} />
              <AuthorizeRoute path="home" roles={["ME"]} element={<Home />} />
              <AuthorizeRoute
                path="files"
                roles={["FILE"]}
                element={<File />}
              />
            </AuthorizeRoute>
            {/* Document */}
            <AuthorizeRoute path="/doc/:noteId" element={<Dashboard />}>
              <AuthorizeRoute index element={<Navigate to="preview" />} />
              <AuthorizeRoute path=":mode" element={<Doc />} />
            </AuthorizeRoute>
            {/* Workspace */}
            <AuthorizeRoute
              path="/workspace/:workspaceId"
              element={<Dashboard />}
            >
              <AuthorizeRoute index element={<Workspace />} />
            </AuthorizeRoute>
            {/* Trash */}
            <AuthorizeRoute path="/trash" element={<Dashboard />}>
              <AuthorizeRoute index element={<Trash />} />
            </AuthorizeRoute>
            {/* Archive */}
            <AuthorizeRoute path="/archive" element={<Dashboard />}>
              <AuthorizeRoute index element={<Archive />} />
            </AuthorizeRoute>
            {/* Shares */}
            <AuthorizeRoute path="/shares" element={<Dashboard />}>
              <AuthorizeRoute index element={<Shares />} />
            </AuthorizeRoute>
            <AuthorizeRoute path="/share/:noteId" element={<Share />} />
            {/* Setting */}
            <AuthorizeRoute path="/settings" element={<Settings />}>
              <AuthorizeRoute index roles={["ME"]} element={<Info />} />
              <AuthorizeRoute
                path="safety"
                roles={["ME_LOGGED_MANAGER"]}
                element={<Safety />}
              />
              <AuthorizeRoute
                path="tokens"
                roles={["TOKEN"]}
                element={<Tokens />}
              />
            </AuthorizeRoute>
            {/* Admin */}
            <AuthorizeRoute path="/admin" element={<Admin />}>
              <Route index element={<Navigate to="home" />} />
              <AuthorizeRoute
                path="home"
                element={<Navigate to="../users" />}
              />
              <AuthorizeRoute path="users" element={<AdminUsers />} />
              <AuthorizeRoute path="roles" element={<AdminRoles />} />
            </AuthorizeRoute>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </div>
  );
};

export default App;
