import React, { useContext, useEffect, useRef, useState } from 'react'
import './index.scss'
import { Button, Input, message, TimePicker } from 'antd'
import dayjs from 'dayjs'
import greyNotice from '@/assets/image/greyNotice.png'
import { Instancercv } from '@/api/api'
import { TimePickerProps } from 'antd/lib'
import sheetDelete from '@/assets/image/sheetDelete.png'
import { useSelector } from 'react-redux'
import { organizeIdSelect } from '@/redux/premission/premission'
import { useLocation, useParams } from 'react-router-dom'
import { DataContext } from '@/pages/equipDetail'

interface tableProps {
  data: Array<any>;
  templateId: number;
  getNurseTemplate: Function;
  type: string
}

export const NurseTable = (props: tableProps) => {
  const token = localStorage.getItem('token')
  const title = [
    {
      key: 'time',
      titleValue: '时间',
      width: '6rem'
    },
    {
      key: 'title',
      titleValue: '护理内容'
    },
    {
      key: 'status',
      titleValue: '状态',
      width: '4rem'
    },
    {
      key: 'delete',
      titleValue: '修改/删除',
      width: '4rem'
    },
  ]


  const { data, templateId, getNurseTemplate, type } = props
  console.log(data)
  /**
   * 计算图表上面的状态
   * @param curStatus 
   * @param lastStatus 
   * @returns 
   */
  const calUpConnect = (curStatus: string, lastStatus: string): string => {
    // if(curStatus)
    if (!lastStatus) {
      return ''
    } else {
      if (curStatus == 'todo') {
        return '#E6EBF0'
      } else {
        return '#0072EF'
      }
    }
  }

  /**
   * 计算图表下面的状态
   * @param curStatus 
   * @param lastStatus 
   * @returns 
   */
  const calDownConnect = (nextStatus: string): string => {
    // if(curStatus)
    if (!nextStatus) {
      return ''
    } else {
      if (nextStatus == 'todo') {
        return '#E6EBF0'
      } else {
        return '#0072EF'
      }
    }
  }

  /**
   * 删除模板中的项目
   * @param time 
   */
  const deleteNurse = (time: string) => {
    console.log(time)
    if (type == 'project') {
      Instancercv({
        method: "post",
        url: "/nursing/delNursingTempItem",
        headers: {
          "content-type": "multipart/form-data",
          "token": token
        },
        params: {
          templateId: templateId,
          templateTime: time,
        }
      }).then((res) => {
        console.log(res)
        getNurseTemplate()
      })
    } else {
      const res = data.filter((item) => item.key != time)
      getNurseTemplate(res)
    }


  }

  return (
    <div className='flex'>
      <div className='grow'>
        <div className='bg-[#F5F8FA] flex '>{title.map((a) => {
          if (type == 'user' && a.key == 'delete') {
            return <></>
          }
          return (
            <div className={`${a.width ? `w-[${a.width}] text-center` : 'grow text-left'} text-xs py-[10px]`}>{a.titleValue}</div>
          )
        })}
        </div>
        {
          data.map((item: any, index) => {
            return (
              <div key={item.key} className='flex py-[13px] relative'>
                {
                  title.map((keys) => {
                    const key = keys.key
                    const timeTextColor = item.status == 'todo' ? '#929EAB' : '#6C7784'
                    const nurseTextColor = item.status == 'todo' ? '#929EAB' : '#32373E'
                    if (key == "key") {
                      return
                    } else {
                      const titleInfo = title.filter((a) => a.key == key)[0]
                      if (key == 'time') {
                        console.log(item[key], 'time')
                        const color = item.status == 'todo' ? '#E6EBF0' : '#0072EF'
                        const upConnect = calUpConnect(item.status, data[index - 1]?.status)
                        const downConnect = calDownConnect(data[index + 1]?.status)
                        return (
                          <div className={`text-xs ${titleInfo.width ? `w-[${titleInfo.width}] text-center` : 'grow text-left'} flex justify-center items-center text-[${timeTextColor}]`}> <span className='w-[3.2rem]'>{item[key]}</span>
                            <div className={`ml-[5px] w-[19px] text-xs h-[19px] rounded-[10px] bg-[${color}] text-[#fff]  flex justify-center items-center`}>
                              <div className={`w-[3px] h-[60%] bg-[${upConnect}] absolute bottom-[80%] z-0`} style={{ backgroundColor: upConnect }}></div>
                              <div className={` w-[19px] text-xs h-[19px] rounded-[10px] bg-[${color}] text-[#fff] flex justify-center items-center z-10`} style={{ backgroundColor: color }}>{index + 1}</div>
                              <div className={`w-[3px] h-[60%] bg-[${downConnect}] absolute top-[80%] z-0`} style={{ backgroundColor: downConnect }}></div>
                            </div>
                          </div>
                        )
                      } else if (key == 'status') {
                        if (item[key] == 'todo') {
                          return <Button className={`${titleInfo.width ? `w-[${titleInfo.width}] text-center` : 'grow text-left'} text-[${timeTextColor}]`} color="default" variant="filled">待完成</Button>
                        }
                        return <Button className={`${titleInfo.width ? `w-[${titleInfo.width}] text-center` : 'grow text-left'} text-[${timeTextColor}]`} type="text">已完成</Button>
                      }

                      else if (key == 'delete' && type == 'user') {
                        return <></>
                      }
                      else if (key == 'delete' && type != 'user') {
                        return <div key={item.key} onClick={() => { deleteNurse(item.key) }} className='flex relative w-[4rem] flex justify-center flex-col items-center'>
                          <img className='w-[1rem]' src={sheetDelete} alt="" />
                          <span className='text-xs text-[#929EAB]'>删除</span>
                        </div>
                      }
                      return (
                        <div className={`${titleInfo.width ? `w-[${titleInfo.width}] text-center` : 'grow text-left'} text-[${nurseTextColor}] text-sm flex items-center justify-center`}>{item[key]}</div>
                      )
                    }
                  })
                }

              </div>

            )
          })
        }</div>


    </div>
  )
}

interface nurseProps {
  type: string
}

/**
 * 
 * @param str 
 * @returns 
 */
export const templateToData = (str: string) => {
  const arr: any = []
  const splitArr = str.replace('{', '').replace('}', '').split(',')
  console.log(splitArr)
  splitArr.forEach((splitItem, index) => {
    if (!splitItem.includes(':')) {
      return
    }
    const key = splitItem.split(':')[0];
    let value = splitItem.split(':')[1];
    value = value.replace(new RegExp('"', 'g'), '')
    console.log(key, value, new Date().toLocaleDateString(), key)
    arr.push({
      title: value,
      time: dayjs(new Date(new Date().toLocaleDateString()).getTime() + Number(key)).format('HH:mm'),
      key: key,
      status: 'todo'
    })
  })
  return arr

}

export default function NurseSetting(props: any) {
  const phone = localStorage.getItem('phone')
  const token = localStorage.getItem('token')
  const organizeId = useSelector(organizeIdSelect)
  const [templateId, setTemplateId] = useState(0)
  const [nurseTemplate, setNurseTemplate] = useState<any>([])

  const [personTemplate, setPersonTemplate] = useState<any>([])

  
  const param = useParams()
  console.log(param)
  const location = useLocation()
  const sensorName = param.id || location.state?.sensorName

  const format = 'HH:mm';
  const { type } = props
  useEffect(() => {

    // if (!type) {
    getNurseTemplate()
    // }

  }, [])

  /**
   * 新建护理模板的护理项目
   */
  const addNurseProject = () => {
    console.log('add')
    Instancercv({
      method: "post",
      url: "/nursing/addNursingTemplItem",
      headers: {
        "content-type": "multipart/form-data",
        "token": token
      },
      params: {
        templateId: templateId,
        templateTime: templateTime,
        templateContent: templateTitle
      }
    }).then((res) => {
      console.log(res.data.msg)
      if (res.data.msg.includes("success")) {
        // const template = res.data.data
        // const data = templateObjToData(template)
        // setNurseTemplate(data)
        getNurseTemplate()
      }

    })
  }

  /**
   * 新建个人页护理模板的护理项目
   */

  const addUserNurseProject = () => {
    const res = [...personTemplate, 
      {
      key: templateTime,
      status: 'todo',
      title: templateTitle,
      time: dayjs(new Date(new Date().toLocaleDateString()).getTime() + Number(templateTime)).format('HH:mm'),
    }
    ]
    setPersonTemplate(res)

  }

  // 添加护理模板里面的内容
  const addProject = () => {
    // 个人页面
    if (type) {
      addUserNurseProject()
    } else {
      addNurseProject()
    }
  }

  /**
   * 获取护理模板
   */
  const getNurseTemplate = () => {
    Instancercv({
      method: "get",
      url: "/nursing/getNurseTemplateData",
      headers: {
        "content-type": "multipart/form-data",
        "token": token
      },
      params: {
        organizeId: organizeId
      }
    }).then((res) => {
      console.log(res)

      setTempplateArr(res.data.data)
      const template = res.data.data[0]
      if (template && !templateId && template.id) {
        getNurseTemplateToId(res.data.data, template.id)
      } else {
        getNurseTemplateToId(res.data.data, templateId)
      }
      // if (template) {
      //   // setTemplateId(template.id)
      //   console.log(template.template)
      //   const data = templateToData(template.template)
      //   // console.log(data)
      //   setNurseTemplate(data)
      //   setTempplateArr(res.data.data)
      // }
    })
  }

  const templateObjToData = (obj: any) => {
    const arr: any = []
    Object.keys(obj).forEach((key, index) => {
      const value = obj[key].replace(new RegExp('"', 'g'), '')
      arr.push({
        title: value,
        time: dayjs(new Date(new Date().toLocaleDateString()).getTime() + Number(key)).format('HH:mm'),
        key: key,
        status: 'todo'
      })
    })
    return arr
  }


  // 通过id获取护理模板
  const getNurseTemplateToId = (arr: any, id: any) => {

    const template: any = arr.find((item: any) => item.id == id)
    setTemplateId(id)
    const data = templateToData(template.template)
    if (type == 'person') {
      setPersonTemplate(data)
    } else {
      setNurseTemplate(data)
    }

  }

  const [templateTime, setTemplateTime] = useState("")
  const [templateTitle, setTemplateTitle] = useState('')
  const [templateNameTitle, setTemplateNameTitle] = useState('')
  const [templateArr, setTempplateArr] = useState([])
  const [selectTemplate, setSelectTemplate] = useState()

  const onChange: TimePickerProps['onChange'] = (time, timeString) => {
    console.log(time, timeString);
    if (typeof timeString == 'string') {
      const h = parseInt(timeString.split(':')[0])
      const m = parseInt(timeString.split(':')[1])
      setTemplateTime(`${h * 60 * 60 * 1000 + m * 60 * 1000}`)
    }
  };

  const userTemplate = () => {
    getNurseTemplate()
  }

  const addTemplate = () => {
    Instancercv({
      method: "post",
      url: "/nursing/addNursingTempl",
      headers: {
        "content-type": "multipart/form-data",
        "token": token
      },
      params: {
        templateName: templateNameTitle,
        template: '{}',
        organizeId: organizeId
      }
    }).then((res) => {
      console.log(res.data.msg)
      if (res.data.msg.includes("success")) {
        getNurseTemplate()
      }

    })
  }

  const context = useContext(DataContext)
  const {getPersonTemplate} = context


  const saveTemplate = () => {
    if(type == 'person'){
      Instancercv({
        method: "post",
        url: "/nursing/updateNursingConfig",
        headers: {
            "content-type": "application/json",
            "token": token
        },
        data: {
            deviceId: sensorName,
            config: JSON.stringify(personTemplate),
        },
    }).then((res) => {
        message.success('添加成功')
        getPersonTemplate()
    })
    }
  }

  return (
    <div className='setContent nurseSetContent sy'>


      {/* 管理员新建模板 */}


      <div className='basis-2/3 mr-[10px] py-[18px] px-[30px] bg-[#fff] relative'>
        {
          !type ?
            <>
              <div className='text-lg font-semibold  relative'>
                新建护理模板
              </div>
              <div className='flex items-center mt-[20px] mb-[20px]'>
                <div className='text-sm font-semibold mr-[2.2rem]'>模板名称:</div>
                <Input className='grow w-[unset]' onChange={(e) => {
                  console.log(e.target.value)
                  setTemplateNameTitle(e.target.value)
                }} />
              </div>
              <Button onClick={addTemplate}>新建模板</Button>

              <div className='text-lg font-semibold  relative'>
                模板列表
              </div>
              <div className='flex items-center mt-[20px] mb-[20px]'>
                {
                  templateArr.map((item: any) => {
                    return (<div onClick={() => {
                      setTemplateId(item.id)
                      getNurseTemplateToId(templateArr, item.id)
                    }} style={{ backgroundColor: templateId == item.id ? 'blue' : '' }}>
                      {item.templateName}
                    </div>)
                  })
                }
              </div>
            </>
            : <></>
        }

        <div className='text-lg font-semibold  relative'>创建个人护理模板
          {type ? <div className='text-[#0072EF] absolute right-[0px] bottom-[0px] text-sm' onClick={userTemplate}>应用模板</div> : ''}
        </div>

        {
          type ?
            <div className='flex items-center mt-[20px] mb-[20px]'>
              <div className='text-sm font-semibold mr-[2.2rem]'>模板列表:</div>
              <div>
                {
                  <div className='flex items-center mt-[20px] mb-[20px]'>
                    {
                      templateArr.map((item: any) => {
                        return (<div onClick={() => {
                          setTemplateId(item.id)
                          getNurseTemplateToId(templateArr, item.id)
                        }} style={{ backgroundColor: templateId == item.id ? 'blue' : '' }}>
                          {item.templateName}
                        </div>)
                      })
                    }
                  </div>
                }</div>
            </div> : <></>
        }

        <div className='flex items-center mt-[20px] mb-[20px]'>
          <div className='text-sm font-semibold mr-[2.2rem]'>项目名称:</div>
          <Input className='grow w-[unset]' onChange={(e) => {
            console.log(e.target.value)
            setTemplateTitle(e.target.value)
          }} />
        </div>
        <div className='flex items-center '>
          <div className='text-sm font-semibold mr-[2.2rem]'>项目时间:</div>
          <TimePicker onChange={onChange} defaultValue={dayjs('12:08', format)} format={format} />
        </div>
        <div className='absolute bottom-[30px] right-[30px]'>
          <Button className='mr-[20px]' onClick={saveTemplate}>保存为模板</Button>
          <Button type="primary" onClick={addProject}>添加</Button>
        </div>

      </div>
      <div className='basis-1/3 bg-[#fff] py-[18px] px-[30px]'>
        <div className='text-lg font-semibold mb-[10px]'>预览护理项目</div>
        <div className='flex items-center mb-[20px]'><img className='w-[0.8rem] h-[0.8rem] mr-[5px]' src={greyNotice} alt="" /><span className='text-xs text-[#929EAB]'>当前内容仅作为效果预览，不可作为实际页面使用</span></div>

        {type == 'person' ?
          // 个人设置
          <NurseTable type={type} getNurseTemplate={setPersonTemplate} templateId={templateId} data={personTemplate} />
          :
          // 管理员设置
          <NurseTable type={type} getNurseTemplate={getNurseTemplate} templateId={templateId} data={nurseTemplate} />
        }

        {/* <NurseTable type={type} getNurseTemplate={getNurseTemplate} templateId={templateId} data={nurseTemplate} /> */}

      </div>
    </div>

  )
}


