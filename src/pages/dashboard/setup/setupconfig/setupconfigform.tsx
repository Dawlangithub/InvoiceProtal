import { useState, useEffect } from "react";
import { BABox, BAButton, BAFormElement } from "../../../../components";
import dayjs from "dayjs";
import BAScreenWrapper from "../../../../reuseableLayout/BAScreenWrapper";
import { formElement } from "../../../../components/BAComponentSwitcher";
import { Get } from "../../../../config/apimethods";
import { message } from "antd";
import { useParams } from "react-router";
import { SetupConfigService } from "../../../../config/apiservices";
import { goBack } from "../../../../config/helpers";
import { SaveOutlined } from "@ant-design/icons";

export default function SetupConfigForm() {

    const params = useParams();

    const [model, setModel] = useState<any>({
        IsActive: true,
        CutOffDate: new Date()
    });
    const [loading, setLoading] = useState(false);
    const [saveLoader, setSaveLoader] = useState(false);

    const elems: formElement[] = [
        {
            col: 3,
            elementType: "input",
            key: "FBRToken",
            label: "FBR Token",
            type: "text",
        },
        {
            col: 3,
            elementType: "input",
            key: "ValidateEndPoint",
            label: "Validate End Point",
            type: "text",
        },
        {
            col: 3,
            elementType: "input",
            key: "PostEndPoint",
            label: "Post End Point",
            type: "text",
        },
        {
            col: 3,
            elementType: "input",
            key: "ServerName",
            label: "Server Name",
            type: "text",
        },
        {
            col: 3,
            elementType: "input",
            key: "DatabaseName",
            label: "Database Name",
            type: "text",
        },
        {
            col: 3,
            elementType: "input",
            key: "UserName",
            label: "User Name",
            type: "text",
        },
        {
            col: 3,
            elementType: "passwordinput",
            key: "Password",
            label: "Password",
            type: "password",
        },

        {
            col: 3,
            elementType: "input",
            key: "ScheduleInterval",
            label: "Schedule Interval",
            type: "text",
        },
        {
            col: 3,
            elementType: "datepicker",
            key: "CutOffDate",
            label: "Cut Off Date",
            type: "date",
            // i want to set data like this 2025-09-04T07:19:57.092 in ChangeEvent
            ChangeEv: (_key: any, date: any, _dateString: any) => {
                if (!date) {
                    setModel({ ...model, CutOffDate: null });
                    return;
                }
                // Format as local timestamp (no timezone) and set to midday to avoid UTC rollover
                const formatted = dayjs(date)
                    .hour(12)
                    .minute(0)
                    .second(0)
                    .millisecond(0)
                    .format("YYYY-MM-DDTHH:mm:ss.SSS");
                setModel({ ...model, CutOffDate: formatted });
            }
        },
        {
            col: 3,
            elementType: "boolean",
            key: "TrustedConnection",
            label: "Trusted Connection",
            type: "boolean",
        },
    ];

    const saveSetupConfig = () => {
        setSaveLoader(true);
        SetupConfigService.Save(model, params.id)
            .then(() => {
                message.success("Setup Config saved successfully");
                goBack();
            })
            .catch((err: any) => {
                message.error(err?.error || err?.message || "Something went wrong");
            })
            .finally(() => {
                setSaveLoader(false);
            });
    };

    const getSetupConfigById = (id: string) => {
        setLoading(true);
        Get(`/setup/${id}`)
            .then((res: any) => {
                setModel({ ...res.Data });
            })
            .catch((err: any) => {
                message.error(err?.error || err?.message || "Failed to load setup config data");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        if (params.id) {
            getSetupConfigById(params.id);
        }
    }, []);

    return (
        <BAScreenWrapper title="Setup Config" actions={[
            {
                displayField: () => (
                    <BAButton
                        onClick={saveSetupConfig}
                        label="Save"
                        loading={saveLoader}
                        icon={<SaveOutlined />}
                    />
                ),
            },
        ]}>
            <BABox className=" bg-white mt-4 p-4 rounded-lg">
                <BAFormElement loading={loading} saveLoader={saveLoader} onSaveClick={saveSetupConfig} model={model} setModel={setModel} formElement={elems} hideButton={true} />

            </BABox>
        </BAScreenWrapper>
    );
}