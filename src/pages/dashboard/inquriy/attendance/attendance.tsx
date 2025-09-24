import { useNavigate } from "react-router";
import { BASetupGrid } from "../../../../components";
import { AttendanceConfig } from "../../../../config/setupconfig";

export default function Attendance() {
    const navigate = useNavigate();

    const addEdit = (row: any) => {
        navigate(`/attendanceform/${row?.Id ? row.Id : ''}`)
    }

    return (
        <>  
            <BASetupGrid showDateRangePicker={true} onAddEdit={addEdit} cols={AttendanceConfig} controller={"attendance"} title={"Attendance"} disableEdit={true} disableDelete={true} disableAdd={true} />
        </>
    )
}