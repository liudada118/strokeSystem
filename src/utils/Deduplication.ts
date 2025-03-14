export   function unique(list: any[]) {
    if (!Array.isArray(list)) {
        console.log('type error!')
        return
    }
    var array = [];
    for (var i = 0; i < list.length; i++) {
        if (array.indexOf(list[i]) === -1) {
            array.push(list[i])
        }
    }
    return array;
}
