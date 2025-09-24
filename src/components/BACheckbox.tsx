import { Checkbox } from 'antd';
import type { CheckboxProps } from 'antd';

type propTypes = {
  isMultiple?: boolean;
  title?: string;
  onChange: CheckboxProps['onChange'];
  checked: boolean
}

const BACheckbox = ({ isMultiple, title, onChange, checked }: propTypes) => {

  return (
    <>
      <Checkbox indeterminate={isMultiple} onChange={onChange} checked={checked}>
        {title}
      </Checkbox>
    </>
  );
};

export default BACheckbox;