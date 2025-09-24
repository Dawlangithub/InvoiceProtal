import { useState } from "react";
import { BABox, BAButton, BAinput, BAPera } from "../components";
import { Post } from "../config/apimethods";
import { message } from "antd";
import einvoiceLogo from "../assets/einvoiceLogo.png";
export default function ForgotPassword() {
    const [model, setModel] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const resetPassword = (e: any) => {
        e.preventDefault();
        setLoading(true);
        Post("/auth/forgot-password", model, null, null, true)
            .then(() => {
                message.success("Password reset link sent to your email");
            })
            .catch((err: any) => {
                message.error(err?.response?.data?.message || err?.message || "Something went wrong");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <BABox
            className="h-screen bg-center bg-cover w-screen flex items-center justify-center bg-gray-100"
        >
            <BABox className="w-[350px] bg-white p-7 py-20 rounded-xl shadow-lg">
                <BABox className="pb-5 text-center flex justify-center">
                    <img src={einvoiceLogo} width={150} alt="" />
                </BABox>
                <BAPera className="text-2xl text-center">Forgot Password</BAPera>
                <form onSubmit={resetPassword}>
                    <BABox className="py-2">
                        <BAinput
                            value={model.email}
                            onChange={(e: any) => {
                                setModel({ ...model, email: e.target.value });
                            }}
                            label={"Email"}
                        />
                    </BABox>
                    <BABox className="py-2">
                        <BAButton
                            loading={loading}
                            htmlType="submit"
                            label={"Send Reset Link"}
                            className="w-full"
                        />
                    </BABox>
                </form>
            </BABox>
        </BABox>
    );
}