import { useEffect, useState } from "react";
import {
  BABox,
  BAButton,
  BAinput,
  BAPasswordInput,
} from "../components";
import logo from "../assets/einvoiceLogo.png";
import { useNavigate } from "react-router";
import { Post } from "../config/apimethods";
import { CloseOutlined } from "@ant-design/icons";

export default function Login() {
  const [model, setModel] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loginUser = (e: any) => {
    e.preventDefault();
    setLoading(true);
    Post("/authentication/login", model, null, null, true)
      .then((res: any) => {
        localStorage.setItem("Token", res.Data.Token);
        localStorage.setItem("RefreshToken", res.Data.RefreshToken);
        localStorage.setItem("User", JSON.stringify(res.Data.User));
        localStorage.setItem("ExpireAct", JSON.stringify(res.Data.ExpireAct));
        navigate("/", { replace: true });
      })
      .catch((error: any) => {
        setError(error.Message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("Token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, []);

  return (
    <BABox className="h-screen w-screen flex py-5 px-10">
      {/* Left side (form) */}
      <BABox className="w-full md:w-1/3 flex flex-col justify-center items-center bg-white p-13 rounded-l-xl">

        <div className="w-full max-w-xs">

          <div className="flex justify-start pb-1">
            <img src={logo} width={130} alt="logo" />
          </div>
          <h2 className="text-3xl font-bold text-left">Sign in</h2>
          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 rounded-md p-3 mt-4 text-sm relative">
              <div>
                {error} Please Enter Correct Credentials
              </div>
              <div className="absolute top-2 right-2 text-xs">
                <CloseOutlined onClick={() => setError("")} />
              </div>
            </div>

          )}

          <form onSubmit={loginUser} className="mt-4">
            <BABox className="py-1">
              <BAinput
                validationType="email"
                isValidate={model.Email}
                value={model.Email}
                variant="outlined"
                onChange={(e: any) =>
                  setModel({ ...model, Email: e.target.value })
                }
                label={"Email"}
              />
            </BABox>
            <BABox className="py-2">
              <BAPasswordInput
                value={model.Password}
                variant="outlined"
                onChange={(e: any) =>
                  setModel({ ...model, Password: e.target.value })
                }
                label={"Password"}
              />
            </BABox>

            <BAButton
              disabled={!model.Email || !model.Password}
              loading={loading}
              htmlType="submit"
              label={"SIGN IN"}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 mt-3"
            />

            <div className="my-4 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-3 text-gray-400 text-sm">E-Invoice</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* <div className="flex justify-center gap-4">
              <button
                type="button"
                className="p-2 border rounded-full hover:bg-gray-100"
              >
                <i className="fab fa-facebook-f"></i>
              </button>
              <button
                type="button"
                className="p-2 border rounded-full hover:bg-gray-100"
              >
                <i className="fab fa-twitter"></i>
              </button>
              <button
                type="button"
                className="p-2 border rounded-full hover:bg-gray-100"
              >
                <i className="fab fa-github"></i>
              </button>
            </div> */}
          </form>
        </div>
      </BABox>

      {/* Right side (welcome message) */}
      <BABox className="hidden md:flex w-2/3 bg-[#1e293b] text-white flex-col justify-center items-start px-16 relative overflow-hidden rounded-r-xl">
        {/* Background Circles */}
        <div className="absolute w-[600px] h-[600px] bg-[#232f41] rounded-full -top-72 -left-72 "></div>
        <div className="absolute w-[600px] h-[600px] bg-[#232f41] rounded-full -bottom-72 -right-72 "></div>

        {/* Dot Pattern */}
        <div
          className="absolute -top-[10px] -right-5 w-30 h-30 opacity-40"
          style={{
            backgroundImage: "radial-gradient(white 1px, transparent 1px)",
            backgroundSize: "0.75rem 0.75rem",
          }}
        ></div>
        <div
          className="absolute -bottom-5 -left-5 w-30 h-30 opacity-40"
          style={{
            backgroundImage: "radial-gradient(white 1px, transparent 1px)",
            backgroundSize: "0.75rem 0.75rem",
          }}
        ></div>
        <div
          className="absolute bottom-[30px] right-10">
          <p className="ml-4 text-gray-300">
            Powered by <span className="text-[#00C5C8]">FINOSYS PVT LTD</span>
          </p>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h1 className="font-bold text-5xl">Welcome to </h1>
          <h2 className="text-5xl font-bold text-[#00C5C8]">E-Invoice</h2>

          <p className="mt-4 text-lg text-gray-400 max-w-lg">
            E-Invoice is a smart platform for creating, managing, and tracking invoices. Fully integrated with FBR requirements, it ensures compliance, improves efficiency, and simplifies your billing process — so you can focus on growing your business.
          </p>
          {/* <div className="flex items-center mt-6">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              className="w-10 h-10 rounded-full border-2 border-white -ml-2"
              alt=""
            />
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              className="w-10 h-10 rounded-full border-2 border-white -ml-2"
              alt=""
            />
            <img
              src="https://randomuser.me/api/portraits/men/45.jpg"
              className="w-10 h-10 rounded-full border-2 border-white -ml-2"
              alt=""
            />
            <p className="ml-4 text-gray-300">
              More than 17k companies joined us, it’s your turn
            </p>
          </div> */}
        </div>
      </BABox>
    </BABox>
  );
}
