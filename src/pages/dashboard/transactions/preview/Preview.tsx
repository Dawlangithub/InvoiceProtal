import { BASetupGrid } from "../../../../components";
import { PreviewConfig } from "../../../../config/setupconfig";

export default function Preview() {
    return (
        <>
            <BASetupGrid cols={PreviewConfig} controller={"transaction/preview"} title={"Preview"} disableAdd={true} disableEdit={true} disableDelete={true} disableExport={true} showDateRangePicker={true}/>
        </>
    )
}