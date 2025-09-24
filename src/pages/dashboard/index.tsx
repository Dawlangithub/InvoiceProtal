import { BABox, BAIconButton } from "../../components";
import logo from "../../assets/einvoiceLogo.png"
import { Navigate, Route, Routes, useNavigate } from "react-router";
import User from "./security/user/user";
import PageNotFound from "./pagenotfound";
import {
  CaretRightOutlined,
  MenuOutlined,
  ProductOutlined,
  UserOutlined,
  SecurityScanFilled,
  SettingFilled,
  AppstoreFilled,
  ScanOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import UserForm from "./security/user/userform";
import { useEffect, useState } from "react";
import MainDashboard from "./maindashboard";
import { Drawer } from "antd";
import Profile from "../profile";
import Role from "./security/role/role";
import RoleForm from "./security/role/roleform";
import SetupConfig from "./setup/setupconfig/setupconfig";
import SetupConfigForm from "./setup/setupconfig/setupconfigform";
import Invoice from "./transactions/invoice/invoice";
import Logs from "./transactions/logs/logs";
import LogsForm from "./transactions/logs/logsform";

export default function DashboardScreen() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['security', 'setup', 'transactions']);
  const [user, setUser] = useState<any>({});

  const menuSections = [
    {
      id: 'security',
      label: 'Security',
      icon: <SecurityScanFilled style={{ fontSize: "1.0em" }} />,
      items: [
        {
          label: "User",
          route: "/user",
          icon: <UserOutlined style={{ fontSize: "1.0em" }} />,
        },
        {
          label: "Role",
          route: "/role",
          icon: <IdcardOutlined style={{ fontSize: "1.0em" }} />,
        },
      ]
    },
    {
      id: 'setup',
      label: 'Setup',
      icon: <SettingFilled style={{ fontSize: "1.0em" }} />,
      items: [

        {
          label: "Setup Config",
          route: "/setupconfig",
          icon: <ProductOutlined style={{ fontSize: "1.0em" }} />,
        },

      ]
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: <AppstoreFilled style={{ fontSize: "1.0em" }} />,
      items: [
        {
          label: "Invoice",
          route: "/invoice",
          icon: <ScanOutlined style={{ fontSize: "1.0em" }} />,
        },
        {
          label: "Logs",
          route: "/logs",
          icon: <IdcardOutlined style={{ fontSize: "1.0em" }} />,
        },
      ]
    },
  ];

  // Derive role from stored user or explicit localStorage key; supports string or array/object forms
  const userHasRole = (u: any, roleName: string): boolean => {
    const target = roleName.toLowerCase();
    const explicit = (localStorage.getItem('Role') || localStorage.getItem('Roles') || '').toLowerCase();
    if (explicit && explicit === target) return true;

    const singleRole = (u?.Role || u?.role || u?.RoleName || u?.roleName || '').toString().toLowerCase();
    if (singleRole === target) return true;

    const roles = u?.Roles || u?.roles || [];
    if (Array.isArray(roles)) {
      return roles.some((r: any) => {
        if (typeof r === 'string') return r.toLowerCase() === target;
        const name = (r?.Name || r?.name || r?.Role || r?.role || '').toString().toLowerCase();
        return name === target;
      });
    }
    return false;
  };

  const isAdmin = userHasRole(user, 'Admin');
  const isUser = userHasRole(user, 'User') && !isAdmin;
  const filteredSections = menuSections.filter((section) => !(isUser && section.id === 'setup') && !(isUser && section.id === 'security'));

  const activeMenu = (menu: string) => {
    return window.location.pathname.includes(menu);
  };

  const handleMenuClick = (route: string) => {
    navigate(route);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isSectionExpanded = (sectionId: string) => {
    return expandedSections.includes(sectionId);
  };

  const renderMenuItem = (item: any) => {
    const isActive = activeMenu(item.route);

    return (
      <div
        onClick={() => handleMenuClick(item.route)}
        className={`group flex items-center px-1 py-1 rounded-md cursor-pointer transition-all duration-200 ${isActive ? 'bg-white/10 text-white border-sky-400' : 'text-slate-300 hover:bg-white/5 hover:text-white border-transparent'
          }`}
      >
        <span className={`text-base mr-3 flex-shrink-0 ${isActive ? 'text-slate-400' : 'text-slate-400 group-hover:text-slate-200'}`}>{item.icon}</span>
        <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>{item.label}</span>
      </div>
    );
  };

  const renderSection = (section: any) => {
    const isExpanded = isSectionExpanded(section.id);

    return (
      <div key={section.id} className="mb-5">
        <div
          onClick={() => open && toggleSection(section.id)}
          className={`group flex items-center justify-between px-2 py-1 cursor-pointer border-b border-slate-800 ${open ? '' : ''}`}
        >
          <div className="flex items-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 select-none">{section.label}</span>
          </div>
          <CaretRightOutlined
            className={`text-xs transition-all duration-200 text-slate-500 ${isExpanded ? 'rotate-90' : 'rotate-0'
              }`}
          />
        </div>
        {open && section.items && (
          <div
            className={`overflow-hidden transition-all duration-200 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
          >
            <div className="space-y-1 mt-2 ">
              {section.items.map((item: any, index: number) => (
                <div key={index}>{renderMenuItem(item)}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    const token = localStorage.getItem("Token")
    // if (!token) {
    //   navigate("/login", { replace: true })
    // }
    let u: any = localStorage.getItem("User");
    try { u = JSON.parse(u || "{}"); } catch { u = {}; }
    setUser(u || {});

    const storedOpen = localStorage.getItem("sidebarOpen");
    if (storedOpen !== null) {
      setOpen(storedOpen === "true");
      window.dispatchEvent(new CustomEvent("sidebar-open-changed", { detail: storedOpen === "true" }));
    }

    const onToggle = () => {
      setOpen(prev => {
        const next = !prev;
        localStorage.setItem("sidebarOpen", String(next));
        window.dispatchEvent(new CustomEvent("sidebar-open-changed", { detail: next }));
        return next;
      });
    };

    window.addEventListener("sidebar-toggle", onToggle as any);
    return () => window.removeEventListener("sidebar-toggle", onToggle as any);
  }, []);

  return (
    <>
      <BABox>

        <BABox
          className={`grid grid-cols-1 md:grid-cols-12 transition-all duration-300 ease-in-out h-screen`}
        >
          <BABox className={`hidden ${open ? 'md:flex md:col-span-2' : 'md:hidden md:col-span-0'} bg-[#0f172a] text-slate-300 flex-col justify-between h-full relative overflow-y-auto transition-all duration-500 ease-in-out`}>
            <BABox className="px-2 pt-4">
              <div className="flex justify-between items-center px-2">
                <img src={logo} width={60} alt="EInvoice" className="object-contain" />
              </div>
              <div className="mt-6 flex flex-col items-center text-center">
                <img src={user.Image} alt="avatar" className="w-20 h-20 rounded-full object-cover" />
                <div className="mt-3 text-white font-medium">{user?.Name?.toUpperCase() || 'User'}</div>
                <div className="text-[12px] text-slate-400">{user?.Email || 'User@gmail.com'}</div>
              </div>
              <div className="mt-10 space-y-1">
                {filteredSections.map((section) => (
                  <div key={section.id}>{renderSection(section)}</div>
                ))}
              </div>
            </BABox>
          </BABox>
          <BABox
            className={`${open ? 'md:col-span-10' : 'md:col-span-12'} transition-all duration-300 ease-in-out h-full overflow-y-auto overflow-x-hidden relative`}
          >
            <BABox className="block md:hidden absolute top-0 left-0 z-50 p-2 ">
              <BAIconButton
                shape="default"
                type="default"
                onClick={() => setMenuOpen(!menuOpen)}
                icon={<MenuOutlined style={{ fontSize: "1.5em" }} />}
              />
            </BABox>
            <Drawer
              width={300}
              placement="left"
              title={"EInvoice"}
              closable={{ "aria-label": "Close Button" }}
              onClose={() => setMenuOpen(false)}
              open={menuOpen}
            >
              {/* Mobile drawer content can remain as before or be simplified */}
            </Drawer>

            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<MainDashboard />} />
              <Route
                path="/user"
                element={<User />}
              />
              <Route
                path="/userform"
                element={<UserForm />}
              />
              <Route
                path="/userform/:id"
                element={<UserForm />}
              />
              <Route
                path="/role"
                element={<Role />}
              />
              <Route
                path="/roleform"
                element={<RoleForm />}
              />
              <Route
                path="/roleform/:id"
                element={<RoleForm />}
              />
              <Route
                path="/setupconfig"
                element={<SetupConfig />}
              />
              <Route
                path="/setupconfigform"
                element={<SetupConfigForm />}
              />
              <Route
                path="/setupconfigform/:id"
                element={<SetupConfigForm />}
              />
              <Route
                path="/invoice"
                element={<Invoice />}
              />
              <Route
                path="/logs"
                element={<Logs />}
              />
              <Route
                path="/logsform"
                element={<LogsForm />}
              />
              <Route
                path="/profile"
                element={<Profile />}
              />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </BABox>
        </BABox>
      </BABox>
    </>
  );
}
