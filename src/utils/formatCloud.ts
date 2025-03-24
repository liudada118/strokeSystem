export const strToObj = (str: any) => {
 
    const newConfig = str.replaceAll("a1a", "[")
    const newConfig1 = newConfig.replaceAll("b1b", "]")
    const newConfig2 = newConfig1.replaceAll("c1c", "{")
    const newConfig3 = newConfig2.replaceAll("d1d", "}")
    // const newConfig4 = newConfig3.replaceAll("\\", "}")
    return newConfig3
  }