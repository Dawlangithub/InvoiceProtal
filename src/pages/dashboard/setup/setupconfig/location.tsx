import { useNavigate } from "react-router";
import { BASetupGrid } from "../../../../components";
import { LocationConfig } from "../../../../config/setupconfig";

export default function Location() {
    const navigate = useNavigate();

    const addEdit = (row: any) => {
        navigate(`/locationform/${row?.Id ? row.Id : ''}`)
    }

    return (
        <>
            <BASetupGrid onAddEdit={addEdit} cols={LocationConfig} controller={"location"} title={"Location"} />
        </>
    )
}