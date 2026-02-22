export const pricewithDiscount = (price, dis = 1) => {
    const numericPrice = Number(price)
    const numericDiscount = Number(dis)

    if (!Number.isFinite(numericPrice) || !Number.isFinite(numericDiscount)) {
        return 0
    }

    const discountAmount = Math.ceil((numericPrice * numericDiscount) / 100)
    const actualPrice = numericPrice - discountAmount
    return actualPrice
}