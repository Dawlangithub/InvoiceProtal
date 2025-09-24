import { useNavigate } from "react-router";
import { BASetupGrid } from "../../../../components";
import { setupConfigConfig } from "../../../../config/setupconfig";

export default function SetupConfig() {
    const navigate = useNavigate();

    const addEdit = (row: any) => {
        navigate(`/setupconfigform/${row?.Id ? row.Id : ''}`)
    }

    return (
        <>
            <BASetupGrid onAddEdit={addEdit} cols={setupConfigConfig} controller={"setup"} title={"Setup Config"}  disableDelete={true} disableExport={true} disableAdd={true}/>
        </>
    )
}