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
import bgImage from "../assets/bg2.png";

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
    <div
      className="h-screen w-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      {/* Main card */}
      <div className="flex h-100 w-4/5 max-w-[870px] shadow-2xl rounded-2xl overflow-hidden backdrop-blur-[4px] bg-white/10 border border-white/20 relative">
        
        {/* Left branding */}
        <div className="hidden md:flex flex-col justify-center w-2/3 bg-[#1e293b] text-white p-10 relative overflow-hidden">
          {/* Background Circles */}
          <div className="absolute w-[500px] h-[410px] bg-[#232f41] rounded-full -bottom-76 -left-72 "></div>

          {/* Dot Pattern */}
          <div
            className="absolute top-[20px] left-[450px] w-30 h-30 opacity-40"
            style={{
              backgroundImage: "radial-gradient(white 1px, transparent 1px)",
              backgroundSize: "0.75rem 0.75rem",
            }}
          ></div>

          <div className="relative z-10 ml-5 mt-[-50px]">
            <img src={logo} alt="logo" className="w-36 mb-2" />
            <h1 className="font-bold text-4xl leading-snug">
              Welcome to <span className="text-[#00C5C8]">E-Invoice</span>
            </h1>
            <p className="mt-2 text-lg text-gray-400 max-w-md">
              E-Invoice is a smart platform for creating, managing, and
              tracking invoices. Fully integrated with FBR requirements.
            </p>
          </div>
        </div>

        {/* Right login form */}
        <div className="w-full md:w-1/3 flex flex-col justify-center items-center p-10 backdrop-blur-[1px]">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 text-center mt-5 mb-2">
              Sign in
            </h2>
            <p className="text-gray-500 text-center mb-3 text-xs">
              Enter credentials to access your account
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 border border-red-200 rounded-md p-3 mb-4 text-sm relative">
                <div>{error} Please Enter Correct Credentials</div>
                <div className="absolute top-2 right-2 text-xs cursor-pointer">
                  <CloseOutlined onClick={() => setError("")} />
                </div>
              </div>
            )}

            <form onSubmit={loginUser}>
              <BABox className="">
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
                loading={loading}
                htmlType="submit"
                label={"SIGN IN"}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 mt-3 rounded-lg shadow-md transition duration-200"
              />
            </form>
          </div>

          <footer className="mt-8 text-xs text-gray-400">
            © {new Date().getFullYear()} E-Invoice. All rights reserved.
          </footer>
        </div>
      </div>
    </div>
  );
}
