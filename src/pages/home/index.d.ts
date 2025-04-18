export interface equip {
    age: number;
    deviceId: string;
    headImg: string | null;
    orderNum: number;
    patientName: string;
    sex?: number;
    roomNum: string;
    chargeMan: string;
    startTime: string;
    onBed: number;
    breath: number;
    heartRate: number;
    pressureInjury: string;
    type: string;
    sensorName: string
    rank: string
    sos: number
    breathAlarm: number
    injuryAlarm: number
    leaveBedAlarm: number
    sosAlarm: number
    strokeAlarm: number
    fallbedAlarm: number
    onbedTime?: number
    outbedTime?: number
    nurseStart: number
    nursePeriod: number
    nurseEnd: number
    leaveBedPeriod: number
    leaveBedEnd: number
    leaveBedStart: number
    situpStart: number
    situpEnd: number
    fallbedEnd: number
    fallbedStart: number
    situpAlarm: number
    strokeValue: any
    status: any
    leavebedParam: any
    // outbedTime
  }

  export interface message {
    roomNum: string;
    patientName: string;
    status: boolean;
    date: string;
    info: string;
  }