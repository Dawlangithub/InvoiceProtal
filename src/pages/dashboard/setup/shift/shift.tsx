import { useNavigate } from "react-router";
import { BASetupGrid } from "../../../../components";
import { ShiftConfig } from "../../../../config/setupconfig";

export default function Shift() {
    const navigate = useNavigate();

    const addEdit = (row: any) => {
        navigate(`/shiftform/${row?.Id ? row.Id : ''}`)
    }

    return (
        <>
            <BASetupGrid onAddEdit={addEdit} cols={ShiftConfig} controller={"workschedule"} title={"Shift"} />
        </>
    )
}