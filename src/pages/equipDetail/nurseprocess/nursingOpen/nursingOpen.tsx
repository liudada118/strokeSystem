import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Select } from 'antd';
import './NursingOpen.scss'
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
// import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import { useSelector } from 'react-redux';
import { organizeIdSelect } from '@/redux/premission/premission'
import shan from '../../../../assets/images/shanjiao.png'
import { Instancercv } from '@/api/api'
import NursingStencil from './nursingStencil'
import NurseTable from '../../../setting/nurseSetting/NurseSetting'
type MenuItem = Required<MenuProps>['items'][number];

// 修改函数名为大写开头，符合 React 组件命名规范
function NursingOpen() {
  const [projectName, setProjectName] = useState<string>(''); // 护理项目名称
  const [hours, setHours] = useState<string>('1小时'); // 小时
  const [minutes, setMinutes] = useState<string>('1分钟'); // 分钟
  const [template, setTemplate] = useState<string>(''); // 模版
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('自理老人护理模版')
  const [type, setType] = useState(1)
  const token = localStorage.getItem('token')
  const organizeId = useSelector(organizeIdSelect)
  const [dataList, setDataList] = useState([])
  const [tempplateArr, setTempplateArr] = useState([])
  // 获取模版数据
  useEffect(() => {
    // 获取模版数据
    Instancercv({
      method: "get",
      url: "/nursing/getNurseTemplateData",
      headers: {
        "content-type": "multipart/form-data",
        "token": token
      },
      params: {
        organizeId: organizeId,
        type: type
      }
    }).then((res: any) => {
      setDataList(res.data.data)
    })
  }, []);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const items = [
    {
      key: '1',
      label: '自理老人护理模版',
    },
    {
      key: '2',
      label: '半自理老人护理模版',
    },
    {
      key: '3',
      label: '失能老人护理模版',
    },
  ];
  const handleDropdownClick = (e: any) => {
    const tit: any = items.find((item) => item.key === e.key);
    setType(Number(e.key));
    setTitle(tit?.label); // 更新标题为点击的菜单项
  };
  const [dataLIst, setDateList] = useState([])
  console.log(dataLIst, '................................................................dataLIst434343');

  const handleSelect = (value: any) => {
    setDateList(value)
  }
  return (
    <div className="w-full h-[43rem] flex justify-between" >
      <div className="w-[43rem] h-[35rem] bg-[#fff]">
        <div className="w-[40rem] h-[30rem] ml-[2.7rem] mt-[2rem] ">
          <h3 className="text-[#000] text-[1.3rem] font-semibold text-[PingFang SC] mb-[1.2rem]">
            创建老陈的护理项
          </h3>
          <div className='NursingOpenVal'>
            <div className='NursingOpenTitle'>护理项目名称 : </div>
            <Input
              style={{ width: "23rem", height: "2.48rem" }}
              placeholder="请输入所添加的护理项目名称"
              allowClear
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div className="NursingOpenVal">

            <div className='NursingOpenTitle'>护理项目时间 : </div>
            <Select
              showSearch
              style={{ width: '8.1rem', height: "2.48rem", marginRight: "1.35rem" }}
              placeholder="小时"
              optionFilterProp="children"
              value={hours}
              onChange={(value) => setHours(value as string)}
            >
              {/* 动态生成小时选项 */}
              {[...Array(23)].map((_, index) => (
                <Select.Option key={index} value={index.toString()}>
                  {index + 1}小时
                </Select.Option>
              ))}
            </Select>
            <Select
              showSearch
              style={{ width: '8.1rem', height: "2.48rem", }}
              placeholder="分钟"
              optionFilterProp="children"
              value={minutes}
              onChange={(value) => setMinutes(value as string)}
            >
              {/* 动态生成分钟选项 */}
              {[...Array(59)].map((_, index) => (
                <Select.Option key={index} value={index.toString()}>
                  {index + 1}分钟
                </Select.Option>
              ))}
            </Select>

          </div>




          <div className="NursingOpenVal">
            <div className='NursingOpenTitle'>护理项目模版 : </div>
            <p>
              <Input
                style={{ height: "2.7rem", width: "14rem" }}
                placeholder="请输入模版名称"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
              />
            </p>
            <span className="ml-2 mr-2">(选填)</span>
            <Button onClick={() => setIsModalOpen(true)} type="primary" className="w-[5.4rem] h-[2.2rem] text-[#fff]">选择模版</Button>
          </div>
          <Button className='w-full h-[2.7rem]' type="primary" block>
            新建护理项目
          </Button>
        </div>
      </div>
      <div className="w-[27rem] h-[43rem] bg-[#fff]">

        <NurseTable onClick={(val: any) => handleSelect(val)}></NurseTable>


      </div>
      <Modal width={'40.45rem'}
        okText='应用此模版'
        cancelText='取消'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[ // 自定义页脚，只包含确认按钮
          <Button key="ok" type="primary" onClick={handleOk}>
            应用此模版
          </Button>,
        ]}
      >
        <div className='h-[32rem] w-[39rem] bg-[#ffff]'>

          <Space direction="vertical">


            <Dropdown menu={{ items, onClick: handleDropdownClick }} placement="bottom">
              <Button onClick={(e: any) => console.log(items, '.......eeeeeee')
              } style={{ border: "none", fontFamily: ' PingFang SC', fontWeight: '600', fontSize: "1.2rem" }}>{title} <img style={{ width: "0.5rem", height: "0.5rem" }} src={shan} alt="" /></Button>
            </Dropdown>


          </Space>
          {/* <div className='w-full h-[28rem] mt-[10px]'>
            <div className='w-[34rem] h-[2.1rem] bg-[#F5F8FA] rounded flex items-center ml-[2rem] mt-[1rem]'>
              <div className='ml-[2.7rem] mr-[6.6rem]'>时间</div>
              <div className='mr-[14.8rem]'>护理内容</div>
              <div> 状态</div>
            </div>
            <div style={{ height: "27rem", overflow: "hidden", padding: "0 2rem" }}>
              <NursingStencil type={type} data={dataList}></NursingStencil>

            </div>
          </div> */}
          <NursingStencil type={type} data={dataList}></NursingStencil>

        </div>
      </Modal >
    </div >
  );
}

export default NursingOpen;