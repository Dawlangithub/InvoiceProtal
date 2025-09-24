import { useNavigate } from "react-router";
import { BASetupGrid } from "../../../../components";
import { UserConfig } from "../../../../config/setupconfig";

export default function User() {
    const navigate = useNavigate();

    const addEdit = (row: any) => {
        navigate(`/userform/${row?.Id ? row.Id : ''}`)
    }

    return (
        <>
            <BASetupGrid onAddEdit={addEdit} cols={UserConfig} controller={"User"} title={"User"} disableExport={true}/>
        </>
    )
}