import React, { useState } from 'react'
import './index.scss'
import { Checkbox, CheckboxProps, Radio, Space, Switch } from 'antd'
import { RadioChangeEvent } from 'antd/lib';
// import { CheckboxValueType } from 'antd/es/checkbox/Group';

const CheckboxGroup = Checkbox.Group;

export default function CustomOption() {
    const [value, setValue] = useState(1);

    const onChange = (e: RadioChangeEvent) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };

    const onSwitchChange = () => {

    }
    const plainOptions = ['5.脑卒中潜在风险预警', '6.全天压力记录', '7.护理记录', '8.翻身卡'];
    const defaultCheckedList = ['']
    const [checkedList, setCheckedList] = useState<any[]>(defaultCheckedList);

    const checkAll = plainOptions.length === checkedList.length;
    const indeterminate = checkedList.length > 0 && checkedList.length < plainOptions.length;

    const onCheckChange = (list: any[]) => {
        setCheckedList(list);
    };



    const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
        setCheckedList(e.target.checked ? plainOptions : []);
    };
    return (
        <div className='customOptionContent projectContent pf'>
            <div className="setItem1 setItem">
                <div className="customTitle">配置翻身流程(单选)</div>
                <div className="customOption">
                    <Radio.Group onChange={onChange} value={value}>
                        <Space direction="vertical">
                            <Radio value={1}>1.一键完成-查看报告</Radio>
                            <Radio value={2}>2.完成护理流程后，查看报告</Radio>
                        </Space>
                    </Radio.Group>
                </div>
            </div>

            <div className="setItem2 setItem">
                <div className="customTitle">配置护理项目</div>
                <div className="customOption">
                    是否开启“记录护理项目 <Switch defaultChecked onChange={onSwitchChange} />
                </div>
            </div>

            <div className="setItem3">
                <div className="customTitle">配置日报内容(多选)</div>
                <div className="customOption">
                    <Checkbox
                        onChange={onCheckAllChange} checked={checkAll}>
                        全选
                    </Checkbox>
                    <Checkbox
                        checked={true}
                        disabled={true}>
                        1.个人信息
                    </Checkbox>
                    <Checkbox
                        checked={true}
                        disabled={true}>
                        2.健康体征
                    </Checkbox>
                    <Checkbox
                        checked={true}
                        disabled={true}>
                        3.睡眠
                    </Checkbox>
                    <Checkbox
                        checked={true}
                        disabled={true}>
                        4.在离床统计
                    </Checkbox>

                    <CheckboxGroup options={plainOptions} value={checkedList} onChange={onCheckChange} />
                </div>
            </div>

        </div>
    )
}
