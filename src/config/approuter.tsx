import { BrowserRouter, Route, Routes } from "react-router";
import DashboardScreen from "../pages/dashboard";
import Login from "../pages/login";
import ForgotPassword from "../pages/forgotpassword";
import ResetPassword from "../pages/resetpassword";
import Overview from "../pages/overview";
import CompanyRegister from "../pages/dashboard/companyregister";

export default function AppRouter() {
    return <BrowserRouter>
        <Routes>
            <Route path="/*" element={<DashboardScreen />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/company-registration" element={<CompanyRegister />} />
        </Routes>
    </BrowserRouter>
}