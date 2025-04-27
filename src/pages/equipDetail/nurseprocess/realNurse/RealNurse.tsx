import React, { useEffect, useState } from 'react'
import './index.scss'
// import Selected from '../selected/Selected'
import no from '@/assets/icon/no.png'
import imgadd from '@/assets/image/imgadd.png'
// import { compressionFile, netUrl } from '../../assets/util'
import axios from 'axios'
import { Input, Select, message } from 'antd'
import { compressionFile } from '@/utils/imgCompressUtil'
import { Instancercv } from '@/api/api'
import Selected from '../selected/Selected'
export default function RealNurse(props: any) {
  const [content, setContent] = useState<any>(new Array(5).fill(0))
  const [selectContent, setSelectContent] = useState<Array<any>>([])
  const [inputContent, setInputContent] = useState<Array<any>>([])
  const [img1, setImg1] = useState<Array<any>>([[]])
  const [normalArr, setNormalArr] = useState<Array<any>>([{}])
  const [inputArr, setInputArr] = useState<Array<any>>([])
  const [selectArr, setSelectArr] = useState<Array<any>>([])
  const [imgArr, setImgArr] = useState<Array<any>>([])
  const [spinning, setSpinning] = React.useState<boolean>(false);

  const phone = localStorage.getItem('phone')
  const token = localStorage.getItem('token')

  message.config({
    top: 100,
    duration: 1.5,
    maxCount: 3,
    rtl: true,
  });
  useEffect(() => {
    Instancercv({
      method: "get",
      url: "/organize/getUserAuthority",
      headers: {
        "content-type": "multipart/form-data",
        "token": token
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

      // setNurseArr(JSON.parse(newConfig3))

      const realConfig = JSON.parse(newConfig3)
      console.log(realConfig)
      const normal = realConfig.filter((a: any) => {
        if (a.checkedList.length == 0 || a.checkedList[0] == '') {
          return a
        }
      })
      const input = realConfig.filter((a: any) => {
        if (a.checkedList.length) {
          return a.checkedList.includes("输入框")
        }

      })
      const select = realConfig.filter((a: any) => {
        if (a.checkedList.length) {
          return a.checkedList.includes("选择框")
        }
      })

      const img = realConfig.filter((a: any) => {
        if (a.checkedList.length) {
          return a.checkedList.includes("照片上传")
        }
      })
      setNormalArr(normal)
      console.log(normal, 'normal')
      setInputArr(input)
      setSelectArr(select)
      setImgArr(img)
      setContent(new Array(normal.length).fill(0))
    })
  }, [])

  // useEffect(() => {
  //   if (localStorage.getItem('nurseArr')) {
  //     const config = localStorage.getItem('nurseArr') || ''
  //     const realConfig = JSON.parse(config)
  //     console.log(realConfig)
  //     const normal = realConfig.filter((a: any) => {
  //       if (a.checkedList[0] == '') {
  //         return a
  //       }
  //     })
  //     const input = realConfig.filter((a: any) => {
  //       if (a.checkedList.length) {
  //         return a.checkedList.includes("输入框")
  //       }

  //     })
  //     const select = realConfig.filter((a: any) => {
  //       if (a.checkedList.length) {
  //         return a.checkedList.includes("选择框")
  //       }
  //     })

  //     const img = realConfig.filter((a: any) => {
  //       if (a.checkedList.length) {
  //         return a.checkedList.includes("照片上传")
  //       }
  //     })
  //     setNormalArr(normal)
  //     setInputArr(input)
  //     setSelectArr(select)
  //     setImgArr(img)
  //     setContent(new Array(normal.length).fill(0))
  //   }

  // }, [])

  const changeObj = (obj: any) => {
    const str = JSON.stringify(obj)
    const newConfig = str.replaceAll("[", "a1a")
    const newConfig1 = newConfig.replaceAll("]", "b1b",)
    const newConfig2 = newConfig1.replaceAll("{", "c1c",)
    const newConfig3 = newConfig2.replaceAll("}", "d1d",)
    return newConfig3
  }


  const arrAddTitle = ({ arr, titleArr }: any) => {
    console.log(arr, titleArr)
    if (!arr.length || !titleArr.length) {
      return []
    }
    return arr.map((a: any, index: any) => {
      return {
        title: titleArr[index].title,
        value: a
      }
    })
  }

  const submit = (res?: any) => {
    let data
    if (!res) {
      data = {
        normalArr: changeObj(arrAddTitle({ arr: content, titleArr: normalArr })),
        imgArr: changeObj(arrAddTitle({ arr: img1, titleArr: imgArr })),
        selectArr: changeObj(arrAddTitle({ arr: selectContent, titleArr: selectArr })),
        inputArr: changeObj(arrAddTitle({ arr: inputContent, titleArr: inputArr }))
      }
    } else if (res.content) {
      data = {
        normalArr: changeObj(arrAddTitle({ arr: res.content, titleArr: normalArr })),
        imgArr: changeObj(arrAddTitle({ arr: img1, titleArr: imgArr })),
        selectArr: changeObj(arrAddTitle({ arr: selectContent, titleArr: selectArr })),
        inputArr: changeObj(arrAddTitle({ arr: inputContent, titleArr: inputArr }))
      }
    } else if (res.imgArr) {
      data = {
        normalArr: changeObj(arrAddTitle({ arr: content, titleArr: normalArr })),
        imgArr: changeObj(arrAddTitle({ arr: res.imgArr, titleArr: imgArr })),
        selectArr: changeObj(arrAddTitle({ arr: selectContent, titleArr: selectArr })),
        inputArr: changeObj(arrAddTitle({ arr: inputContent, titleArr: inputArr }))
      }
    }


    props.changeData(data)
  }
  console.log(normalArr, imgArr,)
  return (
    <>
      {
        normalArr.length ? normalArr.map((a, index) => {
          return (
            <div className="nurseItemTitle" onClick={() => {
              const res = [...content]

              if (res[index] == 0) {
                res[index] = 1
              } else {
                res[index] = 0
              }
              setContent(res)
              submit({ content: res })
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>{index + 1}.{a.title}</div>
                <Selected select={content[index]} />
              </div>
            </div>
          )
        })
          : ''}

      {
        imgArr.length ? imgArr.map((a, index) => {
          return (
            <div className="nurseItemTitle">
              {normalArr ? normalArr.length : 0 + index + 1}.{a.title}
              <div className="secondImgContent" style={{ marginTop: '1rem' }}>
                {img1[index].length ? img1[index].map((a: any, indexs: any) => {
                  return (<div style={{ position: 'relative', width: '6rem', height: '6rem', borderRadius: '6px', overflow: 'hidden', marginRight: '0.4rem' }}>
                    <div style={{
                      width: '6rem', height: '6rem', background: `url(${a}) center center / cover no-repeat `
                    }} ></div>
                    <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'absolute', right: 0, top: 0, width: '1.5rem', height: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottomLeftRadius: '0.8rem' }}>
                      <img src={no}
                        onClick={() => {
                          let imgArr = [...img1[index]]
                          imgArr.splice(indexs, 1)
                          const arr = [...img1]
                          arr[index] = imgArr
                          setImg1(arr)
                          submit({ imgArr: arr })
                        }}
                        alt="" style={{ width: '0.5rem' }} />
                    </div>
                  </div>)
                }) : ''}




                {img1[index].length < 2 ? <div className="addImg" style={{ fontSize: '1rem', fontWeight: 'normal' }}>
                  <img src={imgadd} style={{ marginBottom: '0.38rem', width: '1.28rem' }} alt="" />
                  添加照片
                  <input type="file" accept="image/*" name="img" style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', left: 0, top: 0 }} id="img" onChange={(e) => {

                    setSpinning(true);


                    if (e.target.files) {
                      let res = compressionFile(e.target.files[0])
                      res.then((e) => {


                        Instancercv({
                          method: "post",
                          url: "/file/fileUpload",
                          headers: {
                            "content-type": "multipart/form-data",
                            "token": token
                          },
                          data: {
                            file: e//e.target.files[0],
                          }
                        }).then((res) => {

                          setSpinning(false);
                          message.success('上传成功')
                          const imgArr: any = [...img1[index]]
                          if (img1[index].length == 0) {
                            imgArr[0] = res.data.data.src
                          } else {
                            imgArr[1] = res.data.data.src
                          }
                          const arr = [...img1]
                          arr[index] = imgArr
                          setImg1(arr)
                          submit({ imgArr: arr })
                        }).catch((err) => {
                          setSpinning(false);
                          message.success('上传失败')
                        })

                      })

                      const token = localStorage.getItem('token')

                    }
                  }} />
                </div> : ''}
              </div>
            </div>
          )
        })


          : ''}


      {
        selectArr.map((a, index) => {
          return (
            <div className="nurseItemTitle">  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>{normalArr.length + imgArr.length + index + 1}.{a.title}<Select
              // defaultValue={a.tags[0]}
              style={{ width: 100 }}
              onChange={(e) => {
                const arr = [...selectContent]
                arr[index] = e
                setSelectContent(arr)
                submit()
              }}
              options={a.tags.map((a: any, index: any) => {
                return { value: a, label: a }
              })}
            /></div></div>
          )
        })
      }


      {
        inputArr.map((a, index) => {
          return (<div className="nurseItemTitle">  {normalArr.length + imgArr.length + selectArr.length + index + 1}.{a.title}
            <Input onChange={(e) => {
              const arr = [...inputContent]
              arr[index] = e.target.value
              setInputContent(arr)
              submit()
            }} style={{ marginTop: '1rem' }} />
          </div>)

        })
      }



      {/* <div className="nurseItemTitle" onClick={() => {
                const res = [...content]
                // res[0] = 
                if (res[0] == 0) {
                    res[0] = 1
                } else {
                    res[0] = 0
                }
                setContent(res)
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>1.助餐</div>
                    <Selected select={content[0]} />
                </div>
            </div> */}


    </>
  )
}


{/* <div className="nurseItemTitle" onClick={() => {
                            const res = [...content]
                           
                            if (res[0] == 0) {
                              res[0] = 1
                            } else {
                              res[0] = 0
                            }
                            setContent(res)
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>1.助餐</div>
                              <Selected select={content[0]} />
                            </div>
                          </div>


                          <div className="nurseItemTitle" onClick={() => {
                            const res = [...content]
                     
                            if (res[1] == 0) {
                              res[1] = 1
                            } else {
                              res[1] = 0
                            }
                            setContent(res)
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>2.助浴</div>
                              <Selected select={content[1]} />
                            </div>
                          </div>


                          <div className="nurseItemTitle" onClick={() => {
                            const res = [...content]
                           
                            if (res[2] == 0) {
                              res[2] = 1
                            } else {
                              res[2] = 0
                            }
                            setContent(res)
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>3. 更换床单  </div>
                              <Selected select={content[2]} />
                            </div>
                          </div>


                          <div className="nurseItemTitle" onClick={() => {
                            const res = [...content]
                           
                            if (res[3] == 0) {
                              res[3] = 1
                            } else {
                              res[3] = 0
                            }
                            setContent(res)
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>4. 更换衣物 </div>
                              <Selected select={content[3]} />
                            </div>
                          </div>


                          <div className="nurseItemTitle" onClick={() => {
                            const res = [...content]
                           
                            if (res[4] == 0) {
                              res[4] = 1
                            } else {
                              res[4] = 0
                            }
                            setContent(res)
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>5.敷药 </div> <Selected select={content[4]} />
                            </div>
                          </div>


                          <div className="nurseItemTitle">
                            6.记录压疮位置与大小
                            <div className="secondImgContent" style={{ marginTop: '1rem' }}>
                              {img1.length ? img1.map((a, indexs) => {
                                return (<div style={{ position: 'relative', width: '6rem', height: '6rem', borderRadius: '6px', overflow: 'hidden', marginRight: '0.4rem' }}>
                                  <div style={{
                                    width: '6rem', height: '6rem', background: `url(${a}) center center / cover no-repeat `
                                  }} ></div>
                                  <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'absolute', right: 0, top: 0, width: '1.5rem', height: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottomLeftRadius: '0.8rem' }}>
                                    <img src={no}
                                      onClick={() => {
                                        let imgArr = [...img1]
                                        imgArr.splice(indexs, 1)
                                        setImg1(imgArr)
                                      }}
                                      alt="" style={{ width: '0.5rem' }} />
                                  </div>
                                </div>)
                              }) : ''}


                            

                              {img1.length < 2 ? <div className="addImg" style={{ fontSize: '1rem', fontWeight: 'normal' }}>
                                <img src={imgadd} style={{ marginBottom: '0.38rem', width: '1.28rem' }} alt="" />
                                添加照片
                                <input type="file" accept="image/*" name="img" style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', left: 0, top: 0 }} id="img" onChange={(e) => {

                                  setSpinning(true);
                                  

                                  if (e.target.files) {
                                    let res = compressionFile(e.target.files[0])
                                    res.then((e) => {
                                     

                                      axios({
                                        method: "post",
                                        url: netUrl + "/file/fileUpload",
                                        headers: {
                                          "content-type": "multipart/form-data",
                                          "token": token
                                        },
                                        data: {
                                          file: e//e.target.files[0],
                                        }
                                      }).then((res) => {

                                        setSpinning(false);
                                        message.success('上传成功')
                                        const imgArr: any = [...img1]
                                        if (img1.length == 0) {
                                          imgArr[0] = res.data.data.src
                                        } else {
                                          imgArr[1] = res.data.data.src
                                        }
                                        setImg1(imgArr)

                                      }).catch((err) => {
                                        setSpinning(false);
                                        message.success('上传失败')
                                      })

                                    })

                                    const token = localStorage.getItem('token')

                                  }
                                }} />
                              </div> : ''}
                            </div>
                          </div>

                          
                          <div className="nurseItemTitle">  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>  7.选择皮肤情况  <Select
                            defaultValue={''}
                            style={{ width: 100 }}
                            onChange={(e) => { setSkin(e) }}
                            options={[
                              { value: '6', label: '正常' },
                              { value: '7', label: '发红' },
                              { value: '8', label: '水泡' },
                              { value: '9', label: '破溃' },
                            ]}
                          /></div></div>
                          <div className="nurseItemTitle">  8.备注
                            <Input onChange={(e) => { setRemark(e.target.value) }} style={{ marginTop: '1rem' }} />
                          </div> */}
