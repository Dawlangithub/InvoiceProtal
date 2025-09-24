import { ArrowLeftOutlined } from "@ant-design/icons";
import BABox from "./BABox";
import BAIconButton from "./BAIconButton";
import BAPera from "./BAPera";
import { goBack } from "../config/helpers";

type propsType = {
  title: string;
  headerOptions?: any[];
  disableNav?: boolean;
  onFirst?: any;
  onPrevious?: any;
  onNext?: any;
  onLast?: any;
  authorInfo?: { Created?: string; modified?: string; Posted?: string };
  showAuthorInfo?: boolean;
  disableBack?: boolean;
  extraTitle?: any;
  list?: string;
};
export default function BAScreenHeader(props: propsType) {
  const { title, headerOptions, disableBack, extraTitle, list } = props;

  return (
    <>
      {title !=="Dashboard" && title !=="Process Management" && <BABox className="py-1 flex justify-between items-center">
        <BABox className="flex items-center md:pb-0">
          {list !== "type"
            ? !disableBack && (
                <BAIconButton onClick={goBack} icon={<ArrowLeftOutlined />} />
              )
            : null}
          <BAPera className="md:text-3xl font-semibold text-xl ms-2">
            {title} {extraTitle}
          </BAPera>
        </BABox>
        <BABox className="flex justify-end">
          {headerOptions?.map((option: any, index: number) => {
            return option.isHide ? (
              <></>
            ) : (
              <BABox key={index} className="md:ml-2 ml-1">
                {option.displayField()}
              </BABox>
            );
          })}
        </BABox>
      </BABox>}
    </>
  );
}
