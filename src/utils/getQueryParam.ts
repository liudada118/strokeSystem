export const getQueryParams = (key?: string) => {
  try {
    const queryString = window.location.href.split('?')[1] || '';
    const params = {} as any;

    // 拆分每个参数
    const pairs = queryString.split("&");

    pairs.forEach((pair) => {
      const [key, value] = pair.split("=");
      params[decodeURIComponent(key)] = decodeURIComponent(value || "");
    });

    return key ? params[key] : params;
  } catch (error) {
    return "";
  }
};
