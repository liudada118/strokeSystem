// 封装点击事件逻辑
const handleSettingPop = () => {
    console.log("first");
    try {
        const u = window.navigator.userAgent;
        if (u.indexOf("Android") > -1 || u.indexOf("Adr") > -1) {
            eval(`Android.showSettingPop();`);
        }
    } catch (err: any) {
        console.log(err);
    }
    try {
        eval(`showSettingPop();`);
    } catch (err: any) {
        console.log(err);
    }
  };
  
  export default handleSettingPop;