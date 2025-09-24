import { BAPera } from "../components";
import BAScreenWrapper from "../reuseableLayout/BAScreenWrapper"
import { checkRights } from "./helpers"
import {
    ExclamationCircleOutlined,
} from '@ant-design/icons';

export default function ProtectedRoute({ Component }: any) {
    if (checkRights()) {
        return <Component />
    } else {
        return <BAScreenWrapper disableBack title={""}>
            <div className="p-20 flex flex-col justify-center items-center text-[maroon] text-xl">
                <ExclamationCircleOutlined style={{ fontSize: '2em' }} />
                <BAPera className="ms-2">You do not have access to this page</BAPera>
            </div>
        </BAScreenWrapper>
    }
}