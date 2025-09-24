import { useState, useEffect } from "react";
import { BABox, BAButton, BAPasswordInput, BAPera } from "../components";
import einvoiceLogo from "../assets/einvoiceLogo.png";
import { useNavigate, useSearchParams } from "react-router";
import { Post } from "../config/apimethods";
import { message } from "antd";

export default function ResetPassword() {
    const [model, setModel] = useState<any>({})
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            setModel((prevModel: any) => ({ ...prevModel, token }));
        }
    }, [searchParams]);

    const updatePassword = (e: any) => {
        e.preventDefault()
        if (model.password !== model.confirmPassword) {
            message.error("Password and Confirm Password do not match")
            return
        }
        setLoading(true)
        Post("/auth/reset-password", model, null, null, true).then(() => {
            message.success("Password updated successfully")
            localStorage.clear()
            navigate("/login", { replace: true })
        }).catch((err: any) => {
            message.error(err?.data?.message || err?.message || "Something went wrong")
        }).finally(() => {
            setLoading(false)
        })
    }

    return <>
        <BABox className="h-screen bg-center bg-cover w-screen flex items-center justify-center bg-gray-100">
            <BABox></BABox>
            <BABox className="w-[350px] bg-white p-7 py-20 rounded-xl shadow-lg">
                <BABox className="pb-5 text-center flex justify-center">
                    <img src={einvoiceLogo} width={150} alt="" />
                </BABox>
                <BAPera className="text-2xl text-center">Update Password</BAPera>
                <form onSubmit={updatePassword}>
                    <BABox className="py-2">
                        <BAPasswordInput
                            value={model.password}
                            onChange={(e: any) => {
                                setModel({ ...model, password: e.target.value })
                            }}
                            label={"New Password"}
                        />
                    </BABox>
                    <BABox className="py-2">
                        <BAPasswordInput
                            value={model.confirmPassword}
                            onChange={(e: any) => {
                                setModel({ ...model, confirmPassword: e.target.value })
                            }}
                            label={"Confirm Password"}
                        />
                    </BABox>
                    <BABox className="py-2">
                        <BAButton loading={loading} htmlType="submit" label={"Update Password"} className="w-full" />
                    </BABox>
                </form>
            </BABox>
        </BABox>
    </>;
}