
import {
    LoadingOutlined,
} from '@ant-design/icons';
import BABox from "./BABox"

export default function BALoader() {

    return <>
        <BABox className="flex h-full items-center justify-center">
            <LoadingOutlined style={{ fontSize: '3em' }} />

        </BABox>
    </>
}