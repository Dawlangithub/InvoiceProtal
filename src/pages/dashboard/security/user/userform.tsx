import { useState, useEffect } from "react";
import { BABox, BAButton, BAFormElement } from "../../../../components";
import BAScreenWrapper from "../../../../reuseableLayout/BAScreenWrapper";
import { formElement } from "../../../../components/BAComponentSwitcher";
import { Get } from "../../../../config/apimethods";
import { message } from "antd";
import { useParams } from "react-router";
import { UserService } from "../../../../config/apiservices";
import { goBack } from "../../../../config/helpers";
import { SaveOutlined } from "@ant-design/icons";

export default function UserForm() {

    const params = useParams();

    const [model, setModel] = useState<any>({
        IsActive: true,
        Image: "",
    });
    const [loading, setLoading] = useState(false);
    const [saveLoader, setSaveLoader] = useState(false);
    const [lookupObjs, setLookupObj] = useState({
        rolesObj: {},
    });

    const elems: formElement[] = [
        {
            col: 4,
            elementType: "input",
            key: "username",
            label: "Username",
            type: "text",
            required: true,
        },
        {
            col: 4,
            elementType: "input",
            key: "email",
            label: "Email",
            type: "email",
            required: true,
        },
        {
            col: 4,
            elementType: "passwordinput",
            disabled: params.id ? true : false,
            key: "password",
            label: "Password",
            type: "password",
            required: true,
        },
    ];

    const saveUser = () => {
        setSaveLoader(true);
        UserService.Save(model, params.id)
            .then(() => {
                message.success("User saved successfully");
                goBack();
            })
            .catch((err: any) => {
                message.error(err?.Message);
            })
            .finally(() => {
                setSaveLoader(false);
            });
    };

    const getUserById = (id: string) => {
        setLoading(true);
        Get(`/users/${id}`)
            .then((res: any) => {
                setModel({ ...res.Data });
                setLookupObj({ ...lookupObjs, rolesObj: res.Data.Roles });
            })
            .catch((err: any) => {
                message.error(err?.error || err?.message || "Failed to load user data");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        if (params.id) {
            getUserById(params.id);
        }
    }, []);

    return (
        <BAScreenWrapper title="User" actions={[
            {
                displayField: () => (
                    <BAButton
                        onClick={saveUser}
                        label="Save"
                        loading={saveLoader}
                        icon={<SaveOutlined />}
                    />
                ),
            },
        ]}>
            <BABox className="w-full bg-white mt-4 p-4 rounded-lg">
                <BAFormElement loading={loading} saveLoader={saveLoader} onSaveClick={saveUser} model={model} setModel={setModel} formElement={elems} hideButton={true} />
            </BABox>
        </BAScreenWrapper>
    );
}