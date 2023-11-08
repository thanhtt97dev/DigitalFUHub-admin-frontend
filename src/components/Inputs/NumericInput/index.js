import React from 'react';
import { Input, Tooltip } from 'antd';

const NumericInput = (props) => {
    const { value, onChange } = props;
    const handleChange = (e) => {
        const { value: inputValue } = e.target;
        const reg = /^-?\d*(\.\d*)?$/;
        if (reg.test(inputValue) || inputValue === '' || inputValue === '-') {
            onChange(inputValue);
        }
    };

    // '.' at the end or only '-' in the input box.
    const handleBlur = () => {
        let valueTemp = value;
        onChange(valueTemp.replace(/0*(\d+)/, '$1'));
    };
    const title = props.title ?? ""
    const placeholder = props.placeholder ?? ""
    return (
        <Tooltip trigger={['focus']} title={title} placement="top" overlayClassName="numeric-input">
            <Input
                {...props}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={placeholder}
                maxLength={16}
                value={props.value ?? 0}
            />
        </Tooltip>
    );
};

export default NumericInput;