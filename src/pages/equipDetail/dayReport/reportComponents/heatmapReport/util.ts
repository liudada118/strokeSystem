export const moveValue = ({ value, width }: any) => {
    return value < 0 ? 0 : value > width ? width : value;
  }
  
  export const changePxToValue = ({ value, type, length, progressWidth, lineWidth }: any) => {
    let res;
  
    if (type === "line") {
      res = Math.floor(((value) / (lineWidth - progressWidth)) * (length));
    } else {
      res = Math.floor((value / 580) * (length - 1));
    }
    return res;
  }