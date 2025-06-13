export function fillTimeInterval(existingData: any, minRandom = 15, maxRandom = 18) {
    // 获取昨天和今天的日期
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    // 设置开始和结束时间
    const startTime = new Date(yesterday);
    startTime.setHours(20, 0, 0, 0); // 昨天20:00
    
    const endTime = new Date(today);
    endTime.setHours(12, 0, 0, 0); // 今天12:00
    
    // 创建时间区间内所有分钟的时间点
    const timePoints = [];
    const currentTime = new Date(startTime);
    
    while (currentTime <= endTime) {
        const hours = String(currentTime.getHours()).padStart(2, '0');
        const minutes = String(currentTime.getMinutes()).padStart(2, '0');
        const timeKey = `${hours}:${minutes}`;
        
        timePoints.push({
            time: timeKey,
            timestamp: currentTime.getTime()
        });
        
        // 增加一分钟
        currentTime.setMinutes(currentTime.getMinutes() + 1);
    }
    
    // 创建现有数据的映射，便于查找
    const existingMap = new Map();
    existingData.forEach((item:any) => {
        existingMap.set(item.time, item.perMinuteBreathRate);
    });
    
    // 填充缺失的时间点并生成随机数
    const filledData = timePoints.map(point => {
        if (existingMap.has(point.time)) {
            // 已存在的时间点，使用现有值
            return {
                time: point.time,
                perMinuteBreathRate: existingMap.get(point.time),
                timestamp: point.timestamp
            };
        } else {
            // 不存在的时间点，生成随机数
            // const randomValue = Math.floor(Math.random() * (maxRandom - minRandom + 1)) + minRandom;
            return {
                time: point.time,
                perMinuteBreathRate: null,
                timestamp: point.timestamp
            };
        }
    });
    
    // 按时间排序
    filledData.sort((a, b) => a.timestamp - b.timestamp);
    
    return filledData;
}