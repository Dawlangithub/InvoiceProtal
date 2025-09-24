

import { App, ConfigProvider } from "antd"
import '@ant-design/v5-patch-for-react-19';
export let displayError: (messageTxt: string, severity: "error" | "success") => void;
export let showLoader: (messageTxt: boolean) => void;

export default function MasterContainer(props: any) {
    return <>
        <ConfigProvider
            theme={{
                components: {
                    Button: {
                        colorPrimary: '#242b64',
                        algorithm: true, // Enable algorithm
                    },
                    Input: {
                        colorPrimary: '#242b64',
                        algorithm: true, // Enable algorithm
                    },
                    Switch: {
                        colorPrimary: '#242b64',
                        algorithm: true, // Enable algorithm
                    },
                    Select: {
                        colorPrimary: '#242b64',
                        algorithm: true, // Enable algorithm
                    },
                    DatePicker: {
                        colorPrimary: '#242b64',
                        algorithm: true, // Enable algorithm
                    },
                    Tabs: {
                        colorPrimary: '#242b64',
                        algorithm: true, // Enable algorithm
                    },
                    Checkbox: {
                        colorPrimary: '#242b64',
                        algorithm: true, // Enable algorithm
                    },
                    Steps: {
                        colorPrimary: '#242b64',
                        algorithm: true, // Enable algorithm
                    },
                },
            }}
        >
            <App>
                {props.children}
            </App>
        </ConfigProvider>
    </>
}