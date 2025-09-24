import { useNavigate } from "react-router";
import { BASetupGrid } from "../../../../components";
import { RoleConfig } from "../../../../config/setupconfig";

export default function Role() {
    const navigate = useNavigate();

    const addEdit = (row: any) => {
        navigate(`/roleform/${row?.Id ? row.Id : ''}`)
    }

    return (
        <>
            <BASetupGrid onAddEdit={addEdit} cols={RoleConfig} controller={"role"} title={"Role"} disableAdd={true} disableEdit={true} disableDelete={true} disableExport={true}/>
        </>
    )
}