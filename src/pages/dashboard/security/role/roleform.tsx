import { useState, useEffect } from "react";
import { BABox, BAButton, BAFormElement } from "../../../../components";
import BAScreenWrapper from "../../../../reuseableLayout/BAScreenWrapper";
import { formElement } from "../../../../components/BAComponentSwitcher";
import { Get } from "../../../../config/apimethods";
import { message } from "antd";
import { useParams } from "react-router";
import { RoleService } from "../../../../config/apiservices";
import { goBack } from "../../../../config/helpers";
import { SaveOutlined } from "@ant-design/icons";

export default function RoleForm() {

    const params = useParams();

    const [model, setModel] = useState<any>({
        IsActive: true,
    });
    const [loading, setLoading] = useState(false);
    const [saveLoader, setSaveLoader] = useState(false);

    const elems: formElement[] = [
        {
            col: 3,
            elementType: "input",
            key: "Name",
            label: "Name",
            type: "text",
            required: true
        },
    ];

    const saveRole = () => {
        setSaveLoader(true);
        RoleService.Save(model, params.id)
            .then(() => {
                message.success("Role saved successfully");
                goBack();
            })
            .catch((err: any) => {
                message.error(err?.error || err?.message || "Something went wrong");
            })
            .finally(() => {
                setSaveLoader(false);
            });
    };

    const getRoleById = (id: string) => {
        setLoading(true);
        Get(`/Role/${id}`)
            .then((res: any) => {
                setModel({ ...res.Data });
            })
            .catch((err: any) => {
                message.error(err?.error || err?.message || "Failed to load role data");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        if (params.id) {
            getRoleById(params.id);
        }
    }, []);

    return (
        <BAScreenWrapper title="Role" actions={[
            {
                displayField: () => (
                    <BAButton
                        onClick={saveRole}
                        label="Save"
                        loading={saveLoader}
                        icon={<SaveOutlined />}
                    />
                ),
            },
        ]}>
            <BABox className=" bg-white mt-4 p-4 rounded-lg">
                <BAFormElement loading={loading} saveLoader={saveLoader} onSaveClick={saveRole} model={model} setModel={setModel} formElement={elems} hideButton={true} />

            </BABox>
        </BAScreenWrapper>
    );
}