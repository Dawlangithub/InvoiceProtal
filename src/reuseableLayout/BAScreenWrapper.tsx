import {
  BABox,
  BAScreenHeader,
} from "../components";
import { MenuOutlined } from "@ant-design/icons";
import { useState } from "react";
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
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  console.log(setSidebarOpen);
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
