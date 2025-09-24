import { Button } from "antd";
import BABox from "./BABox";
import { GoogleOutlined } from '@ant-design/icons';
import { firebaseLogin } from "../config/firebase/firebasefunction";
import { useState } from "react";
import { useNavigate } from "react-router";
import { customEncrypt } from "../config/helpers";

export default function GoogleButton() {
    const [loader, setLoader] = useState(false);

    const navigate = useNavigate()

    const handleLogin = () => {
        setLoader(true);
        firebaseLogin()
            .then((res: any) => {
                console.log(res);
                localStorage.setItem("FBR_APP_TOKEN", res.accessToken)
                localStorage.setItem("FBR_APP_USER", customEncrypt(JSON.stringify(res.user)))
                navigate("/", { replace: true })
            })
            .catch((err: any) => {
                console.error(err);
            }).finally(() => {
                setLoader(false);
            })
    };
    return <>
        <BABox className="py-2 text-center">
            <Button loading={loader} onClick={handleLogin} style={{ borderRadius: 100 }} className="px-3"><GoogleOutlined /> Sign In with Google</Button>
        </BABox>
    </>
}