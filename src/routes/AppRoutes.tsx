import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import CreateTest from "../pages/CreateTest";
import Questions from "../pages/Questions";
import Preview from "../pages/Preview";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/create-test" element={<CreateTest />} />

          <Route path="/questions/:id" element={<Questions />} />

          <Route path="/preview/:id" element={<Preview />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
