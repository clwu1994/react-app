// 是否是个数字
const isNumeric = (value: any): boolean => {
    return !isNaN(parseFloat(value)) && isFinite(value)
}
export default isNumeric;