import React from "react";
import { Navigate, Route } from "react-router-dom";
import Index from "./modules/Index";
import { AnonymousRoute } from "./router/AnonymousRoute";
import loadable from "@loadable/component";
import { AuthorizeRoute } from "./router/AuthorizeRoute";
import Routes from "./router/Routes";
import BrowserRouter from "./router/BrowserHistory";
import { history } from "./router/history";

// App
const Login = loadable(() => import("./modules/auth/Login"));
const Register = loadable(() => import("./modules/auth/Register"));
const ResetPassword = loadable(() => import("./modules/auth/ResetPassword"));
const UserInfo = loadable(() => import("./modules/user/UserInfo"));
const Dashboard = loadable(() => import("./modules/dashboard/Dashboard"));
const Admin = loadable(() => import("./modules/admin/Admin"));
const Settings = loadable(() => import("./modules/settings/Settings"));
const Share = loadable(() => import("./modules/share/Share"));
const NotFound = loadable(() => import("./modules/NotFound"));

// Dashboard
const Home = loadable(() => import("./modules/dashboard/panels/Home"));
const File = loadable(() => import("./modules/dashboard/panels/File"));
const Doc = loadable(() => import("./modules/dashboard/panels/Doc"));
const Trash = loadable(() => import("./modules/dashboard/panels/Trash"));
const Archive = loadable(() => import("./modules/dashboard/panels/Archive"));
const Shares = loadable(() => import("./modules/dashboard/panels/Shares"));
const Workspace = loadable(
  () => import("./modules/dashboard/panels/Workspace")
);

// Settings
const Info = loadable(() => import("./modules/settings/panels/Info"));
const Safety = loadable(() => import("./modules/settings/panels/Safety"));
const Tokens = loadable(() => import("./modules/settings/panels/Tokens"));

// Admin
const AdminUsers = loadable(() => import("./modules/admin/panels/Users"));
const AdminRoles = loadable(() => import("./modules/admin/panels/Roles"));

const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter history={history}>
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
            <AuthorizeRoute path="files" roles={["FILE"]} element={<File />} />
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
            <AuthorizeRoute path="home" element={<Navigate to="../users" />} />
            <AuthorizeRoute path="users" element={<AdminUsers />} />
            <AuthorizeRoute path="roles" element={<AdminRoles />} />
          </AuthorizeRoute>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
