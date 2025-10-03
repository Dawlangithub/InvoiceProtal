import { BrowserRouter, Route, Routes } from "react-router";
import DashboardScreen from "../pages/dashboard";
import Login from "../pages/login";
import ResetPassword from "../pages/resetpassword";

export default function AppRouter() {
    return <BrowserRouter>
        <Routes>
            <Route path="/*" element={<DashboardScreen />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
    </BrowserRouter>
}