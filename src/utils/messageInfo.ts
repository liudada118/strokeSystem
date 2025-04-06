export function msgToinfoStr(msg: string): string {
    switch (msg) {
        case 'online':
            return '设备已上线';
        case 'offline':
            return '设备离线';
        case 'breath_stop':
            return '呼吸暂停风险';
        case 'outOffBed':
            return '已离床';
        case 'stroke':
            return '体动风险';
        case 'nursing':
            return '褥疮护理提醒';
        case 'sos':
            return 'SOS求救';
        case 'fallbed':
            return '坠床提醒';
        case 'situp':
            return '坐起提醒';
        default:
            return ''
    }
}

export function alarmValueToType(num: number) {
    if (num == 0) {
        return 'outOffBed'
    } else if (num == 1) {
        return 'fallbed'
    } else if (num == 2) {
        return 'situp'
    } else if (num == 3) {
        return 'nursing'
    } else if (num == 4) {
        return 'offline'
    } else if (num == 5) {
        return 'sos,stroke'
    }
    return num ? "nursing,outOffBed,sos,stroke" : "online,offline"
}