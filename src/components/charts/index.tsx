import React, {
  ReactComponentElement,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import * as echarts from "echarts/core";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent,
} from "echarts/components";
import { LineChart, PieChart, BarChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import "./index.scss";
import dayjs from "dayjs";
import { numToTime, stampToTime } from "@/utils/timeConvert";
import { findMax } from "@/utils/math";
import { colorArr } from "@/constant/constant";
// import { findMax, numToTime, stampToTime } from "@/assets/util";
echarts.use([
  GridComponent,
  LineChart,
  CanvasRenderer,
  PieChart,
  UniversalTransition,
  TooltipComponent,
  LegendComponent,
  BarChart,
  MarkLineComponent,
]);
interface circleChartsData {
  ydata: number;
  xdata: number;
  zdata?: number;
  myChart: any;
  title?: string[];
  moveFlag?: any;
  padding?: any;
  barWidth?: any;
  formatter?: any;
  strokeArr?: any;
}

interface circleData {
  ydata: number;
  xdata: number;
  zdata?: number;
  index: number;
  title: string[];
  padding?: any;
}

interface curveChartData {
  myChart: any;
  xdata: number[];
  ydata: number[];
  text?: string;
  type?: string;
  ymax?: number;
  color?: any;
  interval?: number;
  splitNumber?: number;
  tipFormat?: Function;
  smooth?: boolean;
  step?: string;
  yFormat?: Function;
  mark?: boolean;
  lineColor?: any;
  moveFlag?: any;
  padding?: any;
  barWidth?: any;
  formatter?: any;
  strokeArr?: any;
  fontsize?: any;
  stroke?: any;
  // tipFormat ?: any
}

interface curveIndex {
  xdata: any[];
  ydata: number[];
  text?: string;
  type?: string;
  ymax?: number;
  color?: any;
  interval?: number;
  splitNumber?: number;
  tipFormat?: Function;
  yFormat?: Function;
  smooth?: boolean;
  step?: string;
  index: number;
  mark?: boolean;
  lineColor?: any;
  padding?: any;
  fontsize?: any;
}

export function Charts(props: circleData) {
  useEffect(() => {
    const chart1 = document.getElementById(`chart${props.index}`);
    var myChart: any;
    if (chart1) myChart = echarts.init(chart1);

    initCharts({
      myChart: myChart,
      ydata: props.ydata,
      xdata: props.xdata,
      title: props.title,
      padding: props.padding,
    });
    // myChart.resize();
    // myChart.resize();
    const resize = () => {
      myChart.resize();
    };
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [props.xdata]);
  const initCharts = (props: circleChartsData) => {
    const option = {
      legend: {
        top: "0",
        left: "center",
      },

      series: [
        {
          type: "pie",
          radius: ["0%", "80%"],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "40",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [{ value: props.xdata }, { value: props.ydata }],
        },
      ],
      color: ["#007BFE", "#03DCD2"],
    };
    props.myChart.setOption(option);
  };
  return <div id={`chart${props.index}`} style={{ height: "100%" }}></div>;
}

export function CurveChart(props: curveIndex) {
  useEffect(() => {
    const chart1 = document.getElementById(`chart${props.index}`);
    var myChart: any;
    if (chart1) myChart = echarts.init(chart1);

    initCharts({ myChart: myChart, ...props });

    const resize = () => {
      myChart.resize();
    };
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [props.xdata]);
  const initCharts = (props: curveChartData) => {
    // series
    const {
      xdata,
      ydata,
      text,
      type,
      ymax,
      color,
      lineColor,
      interval,
      splitNumber,
      tipFormat,
      yFormat,
      smooth,
      step,
      mark,
      fontsize,
    } = props;
    console.log(ydata, '.............................ydataydataydataydata');

    let yarr = [];

    const option = {
      tooltip: {
        trigger: "axis",
        show: true,
      },
      grid: {
        x: Array.isArray(props.padding) ? props.padding[0] : 40,
        y: Array.isArray(props.padding) ? props.padding[1] : 30,
        x2: Array.isArray(props.padding) ? props.padding[2] : 20,
        y2: Array.isArray(props.padding) ? props.padding[3] : 30,
      },
      color: ["#006EFF", "#67E0E3", "#9FE6B8"],
      xAxis: {
        type: "category",
        data: [
          "20:00",
          "22:00",
          "00:00",
          "02:00",
          "04:00",
          "06:00",
          "08:00",
          "10:00",
          "12:00",
        ],
        axisLine: {
          show: true,
          color: "#B0B3B8",
          lineStyle: {
            color: "#B0B3B8",
          },
        },
        axisLabel: {
          interval: 0,
          fontSize: 10,
          show: true,
          // interval: interval != undefined ? interval >= 0 ? interval : 2000 : 2000, //x轴间隔多少显示刻度
          showMinLabel: true,
          showMaxLabel: true,
          textStyle: {
            color: "#B0B3B8", //更改坐标轴文字颜色
            fontSize: fontsize ? fontsize : 8, //更改坐标轴文字大小
          },
        },
      },
      yAxis: {
        type: "value",
        minInterval: (Math.ceil(Math.max(...ydata) / 20) * 20) / 4,
        max: ymax,
        name: text ? text : "",
        nameTextStyle: {
          color: "#B0B3B8",
        },
        axisLine: {
          show: true,
          color: "#B0B3B8",
          lineStyle: {
            color: "#B0B3B8",
          },
        },
        axisLabel: {
          show: true,
          // formatter: yFormat ? yFormat : "{value}", //刻度标签的内容格式器，支持字符串模板和回调函数两种形式，按照自己需求设置
          textStyle: {
            color: "#B0B3B8",
            fontSize: fontsize ? fontsize : 8, //更改坐标轴文字大小
          },

          // 这里重新定义就可以
        },
        position: "right",
        // splitNumber: 3,
        splitNumber: splitNumber ? splitNumber : "",
        splitLine: {
          //网格线
          lineStyle: {
            interval: 1,
            type: "dashed", //设置网格线类型 dotted：虚线   solid:实线
            // opacity: 0.6
          },
          show: false, //隐藏或显示
        },
      },
      series: [
        {
          type: type ? type : "line",
          smooth: smooth == undefined ? true : smooth,
          step: step == undefined ? "" : step,
          // data : [1,2,3,4,5,6,7],
          data: color ? color : ydata, //y轴上的数据也是动态的，也作为参数传进来
          symbol: "none",
          // itemStyle: {
          //   normal: {
          //     lineStyle: {
          //       color: lineColor,
          //     },
          //   },
          // },
          lineStyle: {
            width: 1,
            color: lineColor,
          },
          // areaStyle: {
          //   normal: {
          //     color: {
          //       type: 'linear',
          //       x: 0,
          //       y: 0,
          //       x2: 0,
          //       y2: 1,
          //       colorStops: [
          //         {
          //           offset: 0,
          //           color: 'rgba(14,156,255,0.4)' // 0% 处的颜色
          //         },
          //         {
          //           offset: 1,
          //           color: 'rgba(14,156,255,0)' // 100% 处的颜色
          //         }
          //       ],
          //       global: false // 缺省为 false
          //     }
          //   }
          // },
        },
        {
          symbolSize: 20,
          data: [
            ["aaa", 8.04],
            ["bbb", 9.04],
          ],
          type: "line",
          markLine: {
            symbol: ["none", "none"], //去掉箭头
            itemStyle: {
              normal: {
                lineStyle: {
                  type: "solid",
                  color: {
                    //设置渐变
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: "red ", // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: "blue", // 100% 处的颜色
                      },
                    ],
                    global: false, // 缺省为 false
                  },
                },
              },
            },
            label: {
              show: true,
              position: "middle",
            },
            // data: [{
            //   yAxis: props.mark ? 60 : -1,//这里设置false是隐藏不了的，可以设置为-1
            // },]
          },
        },
      ],
    };
    props.myChart.setOption(option);
  };
  return <div id={`chart${props.index}`} style={{ height: "100%" }}></div>;
}

export function SleepChart() {
  return (
    <div className="sleepTtati">
      <div className="sleepItem"></div>.
    </div>
  );
}

interface RealIndex {
  xdata: any[];
  // ydata: number[];
  text?: string;
  type?: string;
  ymax?: number;
  color?: any;
  interval?: number;
  splitNumber?: number;
  tipFormat?: Function;
  yFormat?: Function;
  smooth?: boolean;
  step?: string;
  index: number;
}

interface handleChart {
  ydata: number[];
}

export const RealChart = React.forwardRef((props: RealIndex, refs) => {
 
  var myChart: any;
  const handChangeChart = ({ ydata }: handleChart) => {
    const chart1 = document.getElementById(`chart${props.index}`);
    if (chart1 && !myChart) myChart = echarts.init(chart1);
    initCharts({ myChart: myChart, ...props, ydata: ydata });
  }

  useEffect(() => {
    const chart1 = document.getElementById(`chart${props.index}`);
    var myChart: any;
    if (chart1 && !myChart) myChart = echarts.init(chart1);

    initCharts({ myChart: myChart, ...props, ydata: [] });

    // myChart.resize();
    myChart.resize();
    window.addEventListener("resize", function () {
      myChart.resize();
    });
  }, []);
  const online1 = localStorage.getItem("status")

  const initCharts = (props: curveChartData) => {
    let {
      xdata,
      ydata,
      text,
      type,
      ymax,
      color,
      interval,
      splitNumber,
      tipFormat,
      yFormat,
      smooth,
      step
    } = props;
    const ydata_copy = ydata.find(item => item > 0)
    if (!ydata_copy) {
      ydata = []
    }
    xdata.pop()
    xdata.pop()
    // let newData = 
    const option = {
      tooltip: {
        trigger: "axis",
        // formatter: function (params: any) {
        //   // var color = params.color;//图例颜色

        //   return tipFormat ? tipFormat(params) : `${params[0].value}`;
        // },
      },
      grid: {
        x: 30,
        x2: 10,
        y: 10,
        y2: 30
      },
      color: ["#006EFF", "#67E0E3", "#9FE6B8"],
      xAxis: {
        type: "category",
        data: ['十分钟前', ...xdata, '现在'],
        axisLabel: {
          // formatter: function (value: any) {
          //   if (interval != undefined) {
          //     if (interval >= 0) {
          //       return value;
          //     }
          //   }

          //   if (value == 0) {
          //     return "";
          //   } else {
          //     return (
          //       new Date(parseInt(value)).getHours() +
          //       ":" +
          //       new Date(parseInt(value)).getMinutes()
          //     );
          //   }
          // },
          color: "#b4b4b4",
          show: true,
          interval: interval != undefined ? interval >= 0 ? interval : 2000 : 2000, //x轴间隔多少显示刻度
          showMinLabel: true,
          showMaxLabel: true,
          textStyle: {
            color: "#b4b4b4", //更改坐标轴文字颜色
            fontSize: 12, //更改坐标轴文字大小
          },
        },
        axisLine: {
          lineStyle: {
            color: '#b4b4b4',
            width: 1,//这里是为了突出显示加上的
          }
        }

      },
      yAxis: {
        type: "value",
        // value : ['平躺' ,'平躺','平躺']
        // min: 0,
        // minInterval: 1,
        max: findMax(ydata),
        name: text ? text : '次数(次)',
        nameTextStyle: {
          color: "#000",
        },

        axisLine: {
          lineStyle: {
            color: '#b4b4b4',
            width: 1,//这里是为了突出显示加上的
          }
        },

        axisLabel: {
          show: true,
          formatter: yFormat ? yFormat : "{value}", //刻度标签的内容格式器，支持字符串模板和回调函数两种形式，按照自己需求设置
          textStyle: {
            color: "#b4b4b4",
          },
          // 这里重新定义就可以
        },
        // splitNumber: 3,
        splitNumber: splitNumber ? splitNumber : "",
        splitLine: {
          //网格线
          lineStyle: {
            interval: 1,
            type: "dashed", //设置网格线类型 dotted：虚线   solid:实线
            // opacity: 0.6
          },
          show: false, //隐藏或显示
        },
      },
      series: [
        {
          type: type ? type : "line",
          smooth: smooth == undefined ? true : smooth,
          step: step == undefined ? '' : step,
          // data: [1, 2, 3, 4, 5, 6, 7],
          data: color ? color : ydata, //y轴上的数据也是动态的，也作为参数传进来
          symbol: "none",
          itemStyle: {
            normal: {
              lineStyle: {
                color: "#0067ff",
              },
            },
          },
          lineStyle: {
            width: 1,
          },
          areaStyle: {
            normal: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(14,156,255,0.4)' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(14,156,255,0)' // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            }
          }
        },
      ],
    };
    props.myChart.setOption(option);
  };

  useImperativeHandle(refs, () => ({
    handChangeChart
  }));

  return <div id={`chart${props.index}`} style={{ height: "100%" }}></div>;
})

interface sleepTime {
  max: number;
  data: Array<number>;
  x: string;
  util?: string;
}

export function SleepTimeChart(props: sleepTime) {
  let xArr;
  if (props.x == "week") {
    xArr = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
  } else {
    xArr = [0, 4, 8, 12, 16, 20, 24];
  }

  let yArr;
  let arr = [5, 4, 3, 2, 1, 0];
  // if (props.max < 5) {
  //   yArr = [...arr]
  // } else if (props.max < 5 * 2) {
  //   yArr = [...arr].map(a => a * 2)
  // } else if (props.max < 5 * 3) {
  //   yArr = [...arr].map(a => a * 3)
  // } else if (props.max < 5 * 4) {
  //   yArr = [...arr].map(a => a * 4)
  // }
  yArr = arr.map((a) => (a * props.max) / 5);

  return (
    <div className="sleepTimeContent">
      <div className="yInfo">
        <div className="yInfoContent">
          {yArr.map((a, index) => {
            return (
              <div className="yText">
                {a}
                {props.util ? props.util : "h"}
              </div>
            );
          })}
        </div>
        <div className="yRowContent">
          {yArr.map((a, index) => {
            return (
              <div className="yRow">
                <div className="yRowLine"></div>
              </div>
            );
          })}
          <div className="valueContent">
            {props.data.map((a, index) => {
              return (
                <div className="valueLineContent" style={{}}>
                  <div
                    className="valueLine"
                    style={{
                      height: `${(a * 100) / props.max}%`,
                      backgroundColor:
                        a > props.max * 0.7 ? "#04E4DC" : "#007CFD",
                      position: "relative",
                    }}
                  >
                    {a > 0 ? (
                      <div
                        style={{
                          position: "absolute",
                          textAlign: "center",
                          transform: "translate(-50%, -100%)",
                          width: "3rem",
                        }}
                      >
                        {a}
                        {props.util ? props.util : "h"}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="xTextContent">
            {xArr.map((a, index) => {
              return <div className="xText">{a}</div>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
interface sleepType {
  date: Date;
  data: Array<number>;
  x: string;
}

export function SleepTypeChart(props: sleepType) {
  const dateFormat = "MM-DD";
  let xArr;

  xArr = [4, 8, 12, 16, 20, 24];
  interface DAMNU_ENABLE {
    [key: string]: number[][]; // 字段扩展声明
  }
  let data: DAMNU_ENABLE = {
    "0": [
      [1, 3],
      [2, 4],
      [3, 5],
      [1, 2],
      [3, 3],
      [2, 2],
      [3, 5],
    ],
    "1": [
      [1, 3],
      [3, 3],
      [2, 2],
      [3, 5],
      [2, 4],
      [3, 5],
      [1, 2],
    ],
    "2": [
      [3, 5],
      [1, 2],
      [3, 3],
      [2, 2],
      [3, 5],
      [1, 3],
      [2, 4],
    ],
    "3": [
      [1, 3],
      [2, 4],
      [3, 5],
      [2, 2],
      [3, 5],
      [1, 2],
      [3, 3],
    ],
    "4": [
      [1, 3],
      [3, 5],
      [2, 4],
      [3, 5],
      [1, 2],
      [3, 3],
      [2, 2],
    ],
    "5": [
      [1, 3],
      [2, 4],
      [3, 5],
      [1, 2],
      [3, 5],
      [3, 3],
      [2, 2],
    ],
    "6": [
      [1, 3],
      [3, 5],
      [1, 2],
      [2, 4],
      [3, 3],
      [2, 2],
      [3, 5],
    ],
  };
  const colorArr = ["#03DCD2", "#0076FE", "#89FF6D"];
  let yArr: any = [];
  let arr = [5, 4, 3, 2, 1, 0];
  for (let i = 0; i < 7; i++) {
    yArr[i] = dayjs(
      new Date(props.date).getTime() - 24 * i * 60 * 60 * 1000
    ).format(dateFormat);
  }

  console.log(props.data);

  return (
    <div className="yDate sleepTimeContent">
      <div className="sleepCharts">
        <div className="sleepChart">
          <SleepCharts
            ydata={props.data[0]}
            xdata={props.data[1]}
            zdata={props.data[2]}
            title={[]}
            index={2}
          />
        </div>
        <div className="sleepInfo">
          {["BACK", "LEFT", "RIGHT"].map((a, i) => {
            return (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: i < 2 ? "0.68rem" : "unset",
                }}
              >
                {" "}
                <div
                  className="circle"
                  style={{ backgroundColor: `${colorArr[i]}` }}
                ></div>
                {a}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface categoryChartProps {
  index: any;
  ydata: any;
  xdata: any;
  moveFlag?: any;
  padding?: any;
  barWidth?: any;
  formatter?: any;
  strokeArr?: any;
  yFormat?: Function;
  fontsize?: any;
  stroke?: any;
  tipFormat?: any;
}

export function CategoryChart(props: categoryChartProps) {
  // console.log(props.strokeArr , 'props.strokeArr')
  useEffect(() => {
    const chart1 = document.getElementById(`chart${props.index}`);
    var myChart: any;
    if (chart1) myChart = echarts.init(chart1);

    initCharts({ myChart: myChart, ...props });
    // myChart.resize();
    const resize = () => {
      myChart.resize();
    };
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [props.ydata, props.xdata, props.strokeArr]);
  const initCharts = (props: curveChartData) => {
    const { fontsize } = props;
    const option = {
      tooltip: !props.tipFormat
        ? {
          show: true,
        }
        : {
          show: true,
          formatter: props.tipFormat,
        },
      xAxis: {
        type: "category",
        data: props.xdata,
        minInterval: 12,
        axisLabel: {
          show: true,
          interval: 7,
          textStyle: {
            fontSize: fontsize ? fontsize : 8, //更改坐标轴文字大小
          },

          formatter: props.formatter
            ? function (value: any) {
              console.log(value);
              let tip = value.slice(0, 2);
              return tip;
            }
            : "{value}",
        },
        axisLine: {
          show: true,
          color: "#B0B3B8",
          lineStyle: {
            color: "#B0B3B8",
          },
        },
      },
      yAxis: {
        type: "value",
        // minInterval: 1,
        // splitLine: {
        //   show: props.moveFlag ? false : true
        // },
        // show: props.moveFlag ? false : true,
        axisLabel: {
          formatter: props.yFormat ? props.yFormat : "{value}",
          textStyle: {
            fontSize: fontsize ? fontsize : 8, //更改坐标轴文字大小
          },
        },
        minInterval: props.moveFlag
          ? (Math.ceil(Math.max(...props.ydata) / 10) * 10) / 5
          : 1,
        axisLine: {
          show: true,
          color: "#B0B3B8",
          lineStyle: {
            color: "#B0B3B8",
          },
        },
        position: "right",
        textStyle: {
          fontSize: "8",
        },
      },
      grid: {
        x: Array.isArray(props.padding) ? props.padding[0] : 40,
        y: Array.isArray(props.padding) ? props.padding[1] : 30,
        x2: Array.isArray(props.padding) ? props.padding[2] : 20,
        y2: Array.isArray(props.padding) ? props.padding[3] : 30,
      },
      series: [
        {
          data: props.ydata,
          type: "bar",
          // color: props.strokeArr ? function (params:any) {
          //   console.log(props.strokeArr,params , 'seriesseriesseries')
          //   return props.strokeArr[params.dataIndex]
          // } : '#006CFD',
          barWidth: props.formatter ? 20 : "unset",
          itemStyle: {
            normal: {
              color:
                // props.strokeArr ? function (params: any) {
                //   return (props.strokeArr[params.dataIndex] > 0) ? '#cf7445' : '#006CFD'
                //   return props.strokeArr[params.dataIndex]
                // } :
                "#006CFD",
            },
          },
        },
      ],
    };

    // const option = {
    //   xAxis: {
    //     type: 'category',
    //     data: ['Mon', 'Tue']
    //   },
    //   yAxis: {
    //     type: 'value'
    //   },
    //   series: [
    //     {
    //       data: [120, 200, 150, 80, 70, 110, 130],
    //       type: 'bar'
    //     }
    //   ]
    // };

    props.myChart.setOption(option);
  };
  return <div id={`chart${props.index}`} style={{ height: "100%" }}></div>;
}

export function SleepCharts(props: circleData) {
  useEffect(() => {
    const chart1 = document.getElementById(`chart${props.index}`);
    var myChart: any;
    if (chart1) myChart = echarts.init(chart1);

    initCharts({
      myChart: myChart,
      ydata: props.ydata,
      xdata: props.xdata,
      zdata: props.zdata,
    });
    // myChart.resize();
    window.addEventListener("resize", function () {
      myChart.resize();
    });
  }, [props.ydata, props.xdata, props.zdata]);
  const initCharts = (props: circleChartsData) => {
    const option = {
      legend: {
        top: "0",
        left: "center",
      },
      tooltip: {
        trigger: "item",
        formatter: function (params: any) {
          let tip = "";
          tip = params.percent + "%";
          return tip;
        },
      },
      series: [
        {
          type: "pie",
          radius: ["50%", "80%"],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "40",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: props.xdata },
            { value: props.ydata },
            { value: props.zdata },
          ],
        },
      ],
      color: ["#03DCD2", "#0076FE", "#89FF6D"],
    };
    props.myChart.setOption(option);
  };
  return <div id={`chart${props.index}`} style={{ height: "100%" }}></div>;
}

interface SleepDateType {
  xArr: Array<any>;
  data: Array<any>;
}
export function SleepDateTypeChart(props: SleepDateType) {
  // const dateFormat = 'MM-DD';
  // let xArr

  let xArr = [4, 8, 12, 16, 20, 24];
  // interface DAMNU_ENABLE {

  //   [key: string]: number[][], // 字段扩展声明
  // };
  // let data: DAMNU_ENABLE = {
  //   '0': [[1, 3], [2, 4], [3, 5], [1, 2], [3, 3], [2, 2], [3, 5]],
  //   '1': [[1, 3], [3, 3], [2, 2], [3, 5], [2, 4], [3, 5], [1, 2]],
  //   '2': [[3, 5], [1, 2], [3, 3], [2, 2], [3, 5], [1, 3], [2, 4]],
  //   '3': [[1, 3], [2, 4], [3, 5], [2, 2], [3, 5], [1, 2], [3, 3]],
  //   '4': [[1, 3], [3, 5], [2, 4], [3, 5], [1, 2], [3, 3], [2, 2]],
  //   '5': [[1, 3], [2, 4], [3, 5], [1, 2], [3, 5], [3, 3], [2, 2]],
  //   '6': [[1, 3], [3, 5], [1, 2], [2, 4], [3, 3], [2, 2], [3, 5]],
  // }
  // let data = [[1, 3], [3, 5], [1, 2], [2, 4], [3, 3], [2, 2], [3, 5]]
  // const colorArr = ['linear-gradient( 180deg, #05ECE6 0%, #02D4C8 100%)', 'linear-gradient( 135deg, #009FFF 0%, #006CFD 100%)', '#89ff6d']
  const colorArr = ["#02D4C8", "#006CFD", "#89ff6d"];
  // let yArr: any = []
  // let arr = [5, 4, 3, 2, 1, 0]
  // for (let i = 0; i < 7; i++) {
  //   yArr[i] = dayjs(new Date(props.date).getTime() - 24 * i * 60 * 60 * 1000).format(dateFormat)
  // }
  let yArr = ["右侧卧", "仰卧", "左侧卧"];

  let data = props.data;

  let newArr = [],
    j = 0;
  if (data && data.length) {
    data = data.map((a) => {
      return [a, 1];
    });
    for (let i = 0; i < data.length; i++) {
      if (i == 0) {
        newArr[0] = data[0];
      } else {
        if (data[i][0] == newArr[newArr.length - 1][0]) {
          newArr[newArr.length - 1][1] += data[i][1];
        } else {
          j++;
          newArr[j] = data[i];
        }
      }
    }
    console.log(newArr);
  }

  return (
    <div className="yDay sleepTimeContent">
      <div className="yInfo">
        <div className="yDateInfoContent">
          {yArr.map((a: any, index) => {
            return (
              <div
                className="yText"
                style={{
                  position: "relative",
                  top: index == 2 ? "-0.7rem" : "unset",
                  bottom: index == 0 ? "-0.3rem" : "unset",
                }}
              >
                <span>{a}</span>{" "}
              </div>
            );
          })}
          <div></div>
        </div>
        <div className="yRowContent">
          {yArr.map((a, index) => {
            return (
              <div className="yRow">
                <div className="yRowLine"></div>
              </div>
            );
          })}
          {
            <div className="yDataContent">
              <div className="yData">
                {/* {data.map((b, index) => {
                  return (
                    <div style={{ width: `${b[1] * 100 / 24}%`, borderRadius : '0.16rem', background: colorArr[b[0]-1], height: '100%',position :'relative' , top : b[0] == 1 ? '-180%' : b[0] == 3 ? '180%' : 'unset'  }}></div>
                  )
                })} */}

                {newArr.map((b: any, index) => {
                  return (
                    <div
                      // className={b[0] == 0 ? 'blueGeadient' : b[0] == 1 ? 'otherGeadient' : 'greenGeadient'}
                      style={{
                        backgroundColor: colorArr[b[0]],
                        width: `${(b[1] * 100) / props.data.length}%`,
                        height: "100%",
                        position: "relative",
                        top: b[0] == 1 ? "-180%" : b[0] == 2 ? "180%" : "unset",
                        borderRadius: "2px",
                      }}
                    ></div>
                  );
                })}
              </div>
            </div>
          }

          <div className="xTextContent">
            {props.xArr.map((a, index) => {
              return (
                <div className="xText">
                  {a}
                  {/* {index === 0 ? <span className="zeroXtext">0</span> : ''}  */}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

interface SleepSegAndPropType {
  data: any;
  sleepNums: any;
}

export function SleepSegAndProp(props: SleepSegAndPropType) {
  const [sleepNowNum, setSleepNowNum] = useState<any>({
    index: -1,
    transform: 0,
  });
  const { data } = props;

  useEffect(() => {
    if (document.querySelector(`.showSleep${1}`)) {
      edgeProcess(1);
    }
  }, []);

  function edgeProcess(index: number) {
    const showSleep = document.querySelector(
      `.showSleep${index}`
    ) as HTMLElement;
    const sleepStatuss = document.querySelector(".sleepStatuss") as HTMLElement;
    const showSleepItem = document.querySelector(
      ".showSleepItem"
    ) as HTMLElement;
    const showSleepLeft = showSleep?.getBoundingClientRect().left;
    const sleepStatussLeft = sleepStatuss?.getBoundingClientRect().left;
    const width = showSleep?.getBoundingClientRect().width;
    const showSleepRight = showSleep?.getBoundingClientRect().right;
    const sleepStatussRight = sleepStatuss?.getBoundingClientRect().right;
    // const

    // if (showSleepLeft && sleepStatussLeft) {
    //   if (showSleepLeft < sleepStatussLeft) {
    //     // console.log(showSleep,showSleep.style.transform)
    //     showSleep.style.transform = `translateY(${sleepStatussLeft - showSleepLeft + 56}px)`
    //   }
    // }

    let left =
      showSleepLeft && sleepStatussLeft
        ? showSleepLeft - sleepStatussLeft - 50 < 0
          ? sleepStatussLeft + 50 - showSleepLeft
          : 0
        : 0;
    let right =
      showSleepRight && sleepStatussRight
        ? showSleepRight + 50 - sleepStatussRight > 0
          ? showSleepRight + 50 - sleepStatussRight
          : 0
        : 0;
    const px = left ? left * -1 : right ? right : 0;

    if (width > 100) {
      left = 0;
      right = 0;
    }

    setSleepNowNum({
      index: index,
      transform: left ? left : right ? -right : 0,
      left: left,
      right: right,
    });
  }

  return (
    <div
      className="nurseContent sleepSeg nurseChartsContent"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        className="card marginbottom"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <div className="SegInfo">
          <div className="itemTitleAndData">
            <div className="nurseChartTitleName">分段睡眠数据</div>
          </div>
          <div className="daySleepInfo">
            <div className="daySleepItem">
              <div>
                {numToTime(props.data.light_sleep_time)[1] ? (
                  <>
                    <span className="sleepDataNum">
                      {" "}
                      {numToTime(props.data.light_sleep_time)[1]}
                    </span>
                    <span className="sleepDataUtil">时</span>
                  </>
                ) : null}
                <span className="sleepDataNum">
                  {" "}
                  {numToTime(props.data.light_sleep_time)[0]}
                </span>
                <span className="sleepDataUtil">分钟</span>
              </div>
              <div className="sleepDataUtil">浅睡时长</div>
            </div>
            <div className="daySleepItem">
              <div className="daySleepItemData">
                {numToTime(props.data.deep_sleeping_times)[1] ? (
                  <>
                    <span className="sleepDataNum">
                      {" "}
                      {numToTime(props.data.deep_sleeping_times)[1]}
                    </span>
                    <span className="sleepDataUtil">时</span>
                  </>
                ) : null}
                <span className="sleepDataNum">
                  {" "}
                  {numToTime(props.data.deep_sleeping_times)[0]}
                </span>
                <span className="sleepDataUtil">分钟</span>
              </div>
              <div className="sleepDataUtil">深睡时长</div>
            </div>
          </div>
        </div>
        <div className="circles marginbottom">
          <div className="circleItem">
            <div
              className="circle"
              style={{ backgroundColor: `${colorArr[1]}` }}
            ></div>
            <span>清醒</span>
          </div>
          <div className="circleItem">
            <div
              className="circle"
              style={{ backgroundColor: `${colorArr[2]}` }}
            ></div>
            <span>浅度睡眠</span>
          </div>
          <div className="circleItem">
            <div
              className="circle"
              style={{ backgroundColor: `${colorArr[3]}` }}
            ></div>
            <span>深度睡眠</span>
          </div>
          <div className="circleItem">
            <div
              className="circle"
              style={{ backgroundColor: `${colorArr[0]}` }}
            ></div>
            <span>离床</span>
          </div>
        </div>
        <div className="sleepStatuss">
          {props.data?.sleep_state?.map((item: any, index: number) => {
            return (
              <div
                onClick={() => {
                  edgeProcess(index);
                }}
                onMouseEnter={() => {
                  edgeProcess(index);
                }}
                onMouseLeave={() => {
                  edgeProcess(-1);
                }}
                className={`showSleep${index}`}
                style={{
                  width: `${(100 * item[1]) / props.sleepNums}%`,
                  position: "relative",
                  height: "2.81rem",
                  backgroundColor: colorArr[item[0]],
                  display: "flex",
                  // alignItems: "center",
                  justifyContent: "center",
                  cursor: 'pointer'
                }}
              >
                {sleepNowNum.index == index ? (
                  <>
                    <div
                      className={`showSleep`}
                      // style={{ transform: sleepNowNum.transform ? `translateX(${sleepNowNum.transform}px)` : '' }}
                      style={
                        sleepNowNum.left
                          ? {
                            left:
                              sleepNowNum.left < 25
                                ? sleepNowNum.left - 25
                                : sleepNowNum.left > 40
                                  ? -10
                                  : 0,
                          }
                          : sleepNowNum.right
                            ? {
                              right:
                                sleepNowNum.right < 25
                                  ? -sleepNowNum.right - 25
                                  : sleepNowNum.right > 40
                                    ? -10
                                    : 0,
                            }
                            : {}
                      }
                    >
                      <div className="showSleepItem">
                        <span> {stampToTime(item[2])}</span>
                        <span
                          onClick={() => {
                            setSleepNowNum({
                              index: index,
                              transform: 0,
                              left: 0,
                              right: 0,
                            });
                          }}
                          style={{ width: "2.5rem", textAlign: "center" }}
                        >
                          {" "}
                          {item[0] === 0
                            ? "离床"
                            : item[0] === 1
                              ? "清醒"
                              : item[0] === 2
                                ? "浅睡"
                                : "深睡"}
                        </span>
                      </div>
                    </div>
                    <div className="showSleepTriang"></div>
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
        <div className="timeBar">
          {new Array(20).fill(0).map((a: any, index: any) => {
            return (
              <div
                style={{
                  width: "1px",
                  height: "5px",
                  backgroundColor: "#B0B3B8",
                }}
              ></div>
            );
          })}
        </div>
        <div className="startAndEndTime">
          <div className="timeItem">
            {props.data.data_time ? stampToTime(props.data.data_time[0]) : null}
          </div>
          <div className="timeItem">
            {props.data.data_time
              ? stampToTime(props.data?.data_time[1])
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}
