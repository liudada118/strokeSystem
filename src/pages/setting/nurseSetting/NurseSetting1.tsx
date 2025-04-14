import React, { useEffect, useRef, useState } from 'react'
import deleteImg from '@/assets/image/delete.png'
import { Checkbox, Flex, Input, Modal, Radio, Tag, Tooltip, message, theme } from 'antd';
import type { InputRef, RadioChangeEvent } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
// import { instance, netUrl } from '../../assets/util';
import axios from 'axios';
import { Instancercv } from '@/api/api';
import Title from 'antd/es/skeleton/Title';
import Bottom from '@/components/bottom/Bottom';
// import { useGetWindowSize } from '../../hooks/hook';

const tagInputStyle: React.CSSProperties = {
  width: 64,
  height: 22,
  marginInlineEnd: 8,
  verticalAlign: 'top',
};

const CheckboxGroup = Checkbox.Group;
const plainOptions = ['照片上传', '选择框', '输入框'];
export default function NurseSetting(props: any) {
  const phone = localStorage.getItem('phone')
  const tokenA = localStorage.getItem('token')
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCancel = () => {
    setIsModalOpen(false);
    setCheckedList([''])
    setTags([])
    setTitle('')
  }
  const handleOk = () => {
    setIsModalOpen(false);
    const set = localStorage.getItem('set')
    const newSet = {
      // title :
      title: title,
      checkedList: checkedList,
      tags: tags
    }
    const arr = [...nurseArr, newSet]
    setNurseArr(arr)
    const config = JSON.stringify(arr)
    const newConfig = config.replaceAll("[", "a1a")
    const newConfig1 = newConfig.replaceAll("]", "b1b")
    const newConfig2 = newConfig1.replaceAll("{", "c1c")
    const newConfig3 = newConfig2.replaceAll("}", "d1d")
    Instancercv({
      method: "post",
      url: "/organize/updateOrganization",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "token": tokenA
      },
      params: {
        organizeId: props.organizeId,
        organizeName: props.organizeName,
        comminConfig: newConfig3 //`${arr}`
      },
    }).then(() => {

    })

    localStorage.setItem('nurseArr', JSON.stringify(arr))
  }


  useEffect(() => {
    Instancercv({
      method: "get",
      url: "/organize/getUserAuthority",
      headers: {
        "content-type": "multipart/form-data",
        "token": tokenA
      },
      params: {
        username: phone,
      }
    }).then((res) => {
      console.log(res.data.commonConfig.commonConfig)
      const configStr = res.data.commonConfig.commonConfig

      const newConfig = configStr.replaceAll("a1a", "[")
      const newConfig1 = newConfig.replaceAll("b1b", "]")
      const newConfig2 = newConfig1.replaceAll("c1c", "{")
      const newConfig3 = newConfig2.replaceAll("d1d", "}")

      setNurseArr(JSON.parse(newConfig3))
    })
  }, [])


  // const width = useGetWindowSize()
  const [checkedList, setCheckedList] = useState<string[]>(['']);
  const { token } = theme.useToken();
  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);
  const [img, setImg] = useState(false)
  const [select, setSelect] = useState(false)

  // const [nurseArr, setNurseArr] = useState<any>(localStorage.getItem('nurseArr') ? JSON.parse(localStorage.getItem('nurseArr') || `[]`) : [])
  const [nurseArr, setNurseArr] = useState<any>([])

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [editInputValue]);

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    console.log(newTags);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    setEditInputIndex(-1);
    setEditInputValue('');
  };

  const tagPlusStyle: React.CSSProperties = {
    height: 22,
    background: token.colorBgContainer,
    borderStyle: 'dashed',
  };

  // const onChange = (list: any[]) => {
  //   console.log(list)
  //   setCheckedList(list);
  // };
  // 切换翻身设置
  const onChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    // setValue(e.target.value);
    setSelectValue(e.target.value)
    setCheckedList([e.target.value]);
  };

  const [selectValue, setSelectValue] = useState('')
  const [title, setTitle] = useState('')

  return (
    <div className='setContent sy'>
      <Modal title="添加配置" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <div style={{ display: 'flex', alignItems: 'center' }} className="deviceItem"><div style={{ width: '5rem', }}>护理标题:</div>
          <Input value={title} onChange={(e) => { setTitle(e.target.value) }} />
        </div>
        {/* <div style={{ display: 'flex', alignItems: 'center' }} className="deviceItem"><div style={{ width: '5rem', }}>添加照片:</div>
          <Radio.Group onChange={(e) => {
            setImg(e.target.value)
          }} >
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }} className="deviceItem"><div style={{ width: '5rem', }}>添加下拉框:</div>
          <Radio.Group onChange={(e) => {
            setSelect(e.target.value)
          }} >
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </div> */}

        <div style={{ display: 'flex', alignItems: 'center' }} className="deviceItem"><div style={{ width: '5rem', }}>选择配置:</div>
          {/* <CheckboxGroup style={{ flex: 1 }} options={plainOptions} value={checkedList} onChange={onChange} /> */}
          <Radio.Group onChange={onChange} value={selectValue}>
            <Radio value={''}>确认按钮</Radio>
            <Radio value={'照片上传'}>照片上传</Radio>
            <Radio value={'选择框'}>选择框</Radio>
            <Radio value={'输入框'}>输入框</Radio>
          </Radio.Group>
        </div>

        {checkedList.includes('选择框') ? <div style={{ display: 'flex', alignItems: 'center' }} className="deviceItem"><div style={{ width: '5rem', }}>选择框选项:</div>
          <Flex gap="4px 0" >
            {tags.map<React.ReactNode>((tag, index) => {
              if (editInputIndex === index) {
                return (
                  <Input
                    ref={editInputRef}
                    key={tag}
                    size="small"
                    style={tagInputStyle}
                    value={editInputValue}
                    onChange={handleEditInputChange}
                    onBlur={handleEditInputConfirm}
                    onPressEnter={handleEditInputConfirm}
                  />
                );
              }
              const isLongTag = tag.length > 20;
              const tagElem = (
                <Tag
                  key={tag}
                  closable={true}
                  style={{ userSelect: 'none' }}
                  onClose={() => handleClose(tag)}
                >
                  <span
                    onDoubleClick={(e) => {
                      if (index !== 0) {
                        setEditInputIndex(index);
                        setEditInputValue(tag);
                        e.preventDefault();
                      }
                    }}
                  >
                    {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                  </span>
                </Tag>
              );
              return isLongTag ? (
                <Tooltip title={tag} key={tag}>
                  {tagElem}
                </Tooltip>
              ) : (
                tagElem
              );
            })}
            {inputVisible ? (
              <Input
                ref={inputRef}
                type="text"
                size="small"
                style={tagInputStyle}
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputConfirm}
                onPressEnter={handleInputConfirm}
              />
            ) : (
              <Tag style={tagPlusStyle} icon={<PlusOutlined />} onClick={showInput}>
                新建
              </Tag>
            )}
          </Flex></div> : ''}
      </Modal>
      <Title />

      <div className='setBox'>
        {nurseArr.length ? nurseArr.map((a: any) => {
          return (
            <div className="setTitle">{a.title}
              <img onClick={() => {
                const arr = nurseArr.filter((nurse: any) => nurse.title != a.title)
                localStorage.setItem('nurseArr', JSON.stringify(arr))

                const config = JSON.stringify(arr)
                const newConfig = config.replaceAll("[", "a1a")
                const newConfig1 = newConfig.replaceAll("]", "b1b")
                const newConfig2 = newConfig1.replaceAll("{", "c1c")
                const newConfig3 = newConfig2.replaceAll("}", "d1d")


                Instancercv({
                  method: "post",
                  url: "/organize/updateOrganization",
                  headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    "token": tokenA
                  },
                  params: {
                    organizeId: props.organizeId,
                    organizeName: props.organizeName,
                    comminConfig: newConfig3 //`${arr}`
                  },
                }).then(() => {
                  message.success('删除成功')
                })
                setNurseArr(arr)
              }} style={{ width: '1.76rem', height: '1.76rem' }} src={deleteImg} alt="" />
            </div>
          )
        }) : null}
        {/* <button onClick={() => {
          handleOk()
        }}>添加</button> */}
        <div className='loginOut' onClick={() => { setIsModalOpen(true); }}>
          <div className="loginOutButton">添加</div>
        </div>
      </div>

      <Bottom />
    </div>

  )
}
