import React from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Dashboard from "./Pages/Dashboard/Dashboard";
import HomeLayout from "./Layout/HomeLayout/HomeLayout";
import ApproveReject from "./Pages/ApproveReject/ApproveReject";
import VisitLogs from "./Pages/VisitLogs/VisitLogs";
import Form from "./Componants/Form/Form";
import DigitalPass from "./Pages/DigitalPass/DigitalPass";
import Cookies from 'js-cookie';
import NotFound from "./Pages/NotFound/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import Setting from "./Pages/Setting/Setting";

export default function AppRoutes() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute component={HomeLayout} child={<Dashboard />} />}
        />
        <Route
          path="/visit-logs"
          element={<ProtectedRoute component={HomeLayout} child={<VisitLogs />} />}
        />
          <Route
          path="/setting"
          element={<ProtectedRoute component={HomeLayout} child={<Setting />} />}
        />
        <Route path="/approve-reject/:id/:token" element={<ApproveReject />} />
        <Route path="/digital-pass/:token" element={<DigitalPass />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
