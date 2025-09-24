import { Avatar } from "antd";
import {
  BABox,
  BAMenu,
  BAScreenHeader,
} from "../components";
import { LogoutOutlined, SettingFilled, UserOutlined, MenuOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import logo from "../assets/einvoiceLogo.png";

type propsType = {
  children: React.ReactNode;
  title: string;
  actions?: any[];
  disableNav?: boolean;
  disableBack?: boolean;
  hideHeader?: boolean;
  extraTitle?: any;
  list?: string;
};

export default function BAScreenWrapper(props: propsType) {
  const {
    children,
    title,
    actions,
    disableBack = false,
    disableNav = true,
    hideHeader = false,
    extraTitle,
    list,
  } = props;
  const [loggedInUser, setLoggedInUser] = useState<any>({});
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const navigate = useNavigate();

  const logout = async () => {
    localStorage.clear()
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    let user: any = localStorage.getItem("User");
    user = JSON.parse(user || "{}");
    if (user) {
      setLoggedInUser({ ...user });
    }
    const stored = localStorage.getItem("sidebarOpen");
    if (stored !== null) {
      setSidebarOpen(stored === "true");
    }
    const onSidebarState = (e: any) => setSidebarOpen(!!e?.detail);
    window.addEventListener("sidebar-open-changed", onSidebarState as any);
    return () => window.removeEventListener("sidebar-open-changed", onSidebarState as any);
  }, []);

  const handleToggleSidebar = () => {
    window.dispatchEvent(new CustomEvent("sidebar-toggle"));
  };

  return (
    <BABox className="h-screen overflow-auto">
      {title !== "Registration" && <BABox className=" flex z-50 justify-between items-center bg-[#ffffff] sticky top-0 shadow-sm">
        <BABox className="flex items-center gap-2 py-4 px-5" >
          <button onClick={handleToggleSidebar} className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100">
            {sidebarOpen ? <MenuOutlined /> : <MenuOutlined />}
          </button>
          {!sidebarOpen && <img src={logo} width={80} alt="EInvoice" className="object-contain" />}
        </BABox>
        <BAMenu
          options={[
            {
              label: "Profile",
              onClick: () => {
                navigate("/profile");
              },
              icon: <UserOutlined />,
            },
            {
              label: "Logout",
              onClick: logout,
              icon: <LogoutOutlined />,
            },
          ]}
        >
          <BABox className="flex items-center gap-2 cursor-pointer rounded-3xl mr-3 px-[10px] py-[6px] hover:bg-gray-100 transition-colors duration-200 bg-gray-100">
            <Avatar
              style={{
                backgroundColor: "#242b64",
                color: "white",
                fontWeight: "600",
                fontSize: "12px",
              }}
              size={25}
            >
              {(loggedInUser.Name || loggedInUser.Email || "U")
                ?.charAt(0)
                ?.toUpperCase()}
            </Avatar>
            <SettingFilled className="textPrimary text-lg" />
          </BABox>
        </BAMenu>
      </BABox>}
      <BABox className="px-5 py-3">
        {!hideHeader && (
          <BAScreenHeader
            list={list}
            extraTitle={extraTitle}
            title={title}
            headerOptions={actions}
            disableNav={disableNav}
            disableBack={disableBack}
          />
        )}
        {children}
      </BABox>
    </BABox>
  );
}
