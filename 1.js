function rateToHeart(value) {
    if (value <= 0) return 0
    // const x = value < 10 ? 10  : value < 35 ? 35value  

    let x;
    if(value < 10){
        x = 10
    }else if(value <= 35){
        x = value
    }else{
        x = 35
    }
    const y = Math.pow((x), 2) * (-0.0533) + 5.6 * (x) - 10.67
    return Math.floor(y)

}

for(let i= 0 ; i < 1000 ; i ++){
    const value = rateToHeart(i);
    console.log(i , value)
}