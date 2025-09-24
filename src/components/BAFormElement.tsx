

import { Col, Row, Skeleton } from "antd";
import BAComponentSwitcher, { formElement } from "./BAComponentSwitcher"
import BABox from "./BABox";
import BAButton from "./BAButton";
import { SaveOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { checkRequired } from "../config/helpers";

type propsType = {
    model: any,
    setModel: any,
    formElement: formElement[],
    onSaveClick?: () => void,
    saveLoader?: boolean
    disabledForm?: boolean,
    loading?: boolean,
    containerClass?: string,
    buttonContainerClass?: string,
    customButton?: React.ReactNode,
    hideButton?: boolean
}

export default function BAFormElement(props: propsType) {
    const { model, setModel, formElement, disabledForm, saveLoader, onSaveClick, loading, containerClass, buttonContainerClass, customButton, hideButton } = props;

    const saveClick = () => {
        if (checkRequired(formElement, model) && onSaveClick) {
            onSaveClick()
        }
    }

    return <>
        <BABox className={classNames("overflow-hidden", containerClass)}>
            <Row>
                {formElement.map((element, index) => {
                    return !element.isHide && <Col key={index} xs={24} sm={24} md={element.col * 2} className={element.className}>
                        {loading ? <BABox className="p-1"><Skeleton.Input block active /></BABox> : <BABox className="p-[7px]">
                            <BAComponentSwitcher
                                element={element}
                                model={model}
                                setModel={setModel}
                                disabledForm={disabledForm}
                            />
                        </BABox>}
                    </Col>
                })}
                {!hideButton && <Col span={24}>
                    <BABox className={classNames("p-2 bg-[#d8dde8] text-end", buttonContainerClass)}>
                        {customButton ? customButton : <BAButton className="bg-secondary" disabled={loading} loading={saveLoader} onClick={saveClick} icon={<SaveOutlined />} label="Save" />}
                    </BABox>
                </Col>}
            </Row>
        </BABox>
    </>

}